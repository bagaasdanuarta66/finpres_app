import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs'; // <-- Impor firstValueFrom
import { ContentService, Program } from '../services/content.service';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.page.html',
  styleUrls: ['./program-detail.page.scss'],
  standalone : false,
})
export class ProgramDetailPage implements OnInit {

  program$: Observable<Program>;
  programId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.programId = this.route.snapshot.paramMap.get('id')!;
    this.program$ = this.contentService.getProgramById(this.programId);
  }

  ngOnInit() {}

  async register() {
    // --- PERBAIKAN UTAMA ADA DI SINI ---
    // Menggunakan 'firstValueFrom' untuk mengambil data user secara asinkron.
    // Ini lebih aman karena menunggu sampai status login benar-benar terkonfirmasi.
    const user = await firstValueFrom(this.authService.currentUser$);
    
    if (!user) {
      this.presentToast('Anda harus login untuk mendaftar.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Mendaftarkan...' });
    await loading.present();

    try {
      await this.contentService.registerForProgram(this.programId, user.uid);
      await loading.dismiss();
      this.presentToast('🎉 Selamat! Anda berhasil terdaftar.');
      this.router.navigateByUrl('/tabs/tab4');
    } catch (error: any) {
      await loading.dismiss();
      console.error('Gagal mendaftar:', error);
      this.presentToast(error.message || 'Gagal mendaftar. Coba lagi.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}

