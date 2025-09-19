import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs'; // <-- TAMBAHAN: 'of' diimpor
import { ContentService, Program } from '../services/content.service';
import { AuthService } from '../services/auth.service'; // <-- TAMBAHAN: Impor AuthService
import { switchMap } from 'rxjs/operators'; // <-- TAMBAHAN: Impor switchMap

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
  standalone: false,
})
export class Tab4Page implements OnInit {

  allPrograms$: Observable<Program[]>;
  myPrograms$: Observable<any[]>; // <-- TAMBAHAN: Untuk menampung "Program Saya"
  
  // <-- TAMBAHAN: Variabel untuk mengontrol filter/segmen
  selectedSegment: string = 'semua'; 
  activeCategory: string = 'semua';

  // Kategori bisa tetap statis untuk saat ini
  categories: Category[] = [
    { id: 'kompetisi', icon: '🏆', title: 'Kompetisi', count: 25, badge: 'POPULER' },
    { id: 'sosial', icon: '🤝', title: 'Project Sosial', count: 18, badge: 'TRENDING' },
    { id: 'seni', icon: '🎨', title: 'Seni & Pentas', count: 22, badge: 'KREATIF' },
    { id: 'sains', icon: '🔬', title: 'Project Sains', count: 15, badge: 'INOVATIF' },
  ];

  constructor(
    private contentService: ContentService,
    private authService: AuthService, // <-- TAMBAHAN: Suntikkan AuthService
    private router: Router
  ) {
    // Mengambil data SEMUA program
    this.allPrograms$ = this.contentService.getPrograms();

    // <-- TAMBAHAN: Mengambil data "PROGRAM SAYA"
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

  // <-- TAMBAHAN: Fungsi untuk mengubah segmen
  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  // <-- TAMBAHAN: Fungsi untuk mengubah filter kategori
  filterByCategory(category: string) {
    this.activeCategory = category;
  }
}