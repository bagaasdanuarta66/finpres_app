// src/app/tabs/tab4/tab4.page.ts

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { ContentService, Program } from '../services/content.service';
import { AuthService } from '../services/auth.service';
import { switchMap, tap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { ProgramProgressModalComponent } from '../components/program-progress-modal/program-progress-modal.component';
import { AddProgramFormComponent } from '../components/add-program-form/add-program-form.component';
// Interface Category tidak perlu diubah
interface Category {
  id: string;
  icon: string;
  title: string;
  count: number;
  badge: string;
}

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone : false,
})
export class Tab4Page implements OnInit {

  allPrograms$: Observable<Program[]>;
  myPrograms$: Observable<any[]>;
  selectedSegment: string = 'semua';
  activeCategory: string = 'semua';
  categories: Category[] = [
    { id: 'kompetisi', icon: '🏆', title: 'Kompetisi', count: 0, badge: 'POPULER' },
    { id: 'sosial', icon: '🤝', title: 'Project Sosial', count: 0, badge: 'TRENDING' },
    { id: 'seni', icon: '🎨', title: 'Seni & Pentas', count: 0, badge: 'KREATIF' },
    { id: 'sains', icon: '🔬', title: 'Project Sains', count: 0, badge: 'INOVATIF' },
  ];

  constructor(
    private contentService: ContentService,
    public authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    this.allPrograms$ = this.contentService.getPrograms().pipe(
      tap(programs => {
        const today = new Date();
        programs.forEach(prog => {
          if (prog.deadline) {
            const deadlineDate = new Date(prog.deadline);
            prog.isExpired = deadlineDate < today;
          } else {
            prog.isExpired = false;
          }
        });
        this.categories.forEach(cat => {
          cat.count = programs.filter(p => p.kategori === cat.id).length;
        });
        this.cdr.detectChanges();
      })
    );
    this.myPrograms$ = this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.contentService.getRegisteredProgramsForUser(user.uid);
        } else {
          return of([]);
        }
      })
    );
  }

  ngOnInit() { }

  viewProgram(program: Program) {
    this.router.navigate(['/program-detail', program.id]);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  filterByCategory(category: string) {
    this.activeCategory = category;
  }

  async openProgressModal(program: any) {
    const modal = await this.modalCtrl.create({
      component: ProgramProgressModalComponent,
      componentProps: { programData: program }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.newProgress) {
      try {
        await this.contentService.addProgramProgress(program.id, data.newProgress);
        console.log("Progres berhasil disimpan!");
      } catch (error) {
        console.error("Gagal menyimpan progres:", error);
      }
    }
  }

  // FUNGSI INI SEKARANG BERADA DI DALAM CLASS
  async tambahProgramBaru() {
    const modal = await this.modalCtrl.create({
      component: AddProgramFormComponent,
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data) {
      try {
        const user = await firstValueFrom(this.authService.currentUser$);
        if (!user) throw new Error('User tidak ditemukan.');
        
        await this.authService.addProgram(user.uid, data);
        console.log('Program baru berhasil disimpan!');
      } catch (error) {
        console.error('Gagal menyimpan program baru:', error);
      }
    }
  }
} // <-- TUTUP KURUNG UNTUK CLASS. KODE YANG SALAH DI BAWAH SUDAH DIHAPUS