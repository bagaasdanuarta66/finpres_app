import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// 1. Impor service dan interface Program yang standar
import { ContentService, Program } from '../services/content.service';

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

  // 2. Ganti array statis dengan satu Observable
  allPrograms$: Observable<Program[]>;
  
  // Kategori bisa tetap statis untuk saat ini
  categories: Category[] = [
    { id: 'kompetisi', icon: '🏆', title: 'Kompetisi', count: 25, badge: 'POPULER' },
    { id: 'sosial', icon: '🤝', title: 'Project Sosial', count: 18, badge: 'TRENDING' },
    { id: 'seni', icon: '🎨', title: 'Seni & Pentas', count: 22, badge: 'KREATIF' },
    { id: 'sains', icon: '🔬', title: 'Project Sains', count: 15, badge: 'INOVATIF' },
  ];

  constructor(
    // 3. Suntikkan ContentService dan Router
    private contentService: ContentService,
    private router: Router
  ) {
    // 4. Ambil data program dari service saat halaman dibuat
    this.allPrograms$ = this.contentService.getPrograms();
  }

  ngOnInit() { }

  // 5. Fungsi ini sekarang akan mengarahkan ke halaman detail
  viewProgram(program: Program) {
    this.router.navigate(['/program-detail', program.id]);
  }

  // CATATAN: Fungsi filterPrograms dan openCategory Anda yang lama
  // bisa tetap ada di sini, tapi untuk saat ini tidak akan berfungsi
  // dengan data dinamis sampai kita hubungkan dengan query Firestore.
}

