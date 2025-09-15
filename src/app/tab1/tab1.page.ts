import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService, NotificationItem } from '../services/notification.service';
import { ContentService, Program } from '../services/content.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  
  userProfile$!: Observable<any | null>;
  unreadCount$!: Observable<number>;
  popularPrograms$!: Observable<Program[]>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private contentService: ContentService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Ambil profil user saat ini dari Firestore
     // Mengambil profil pengguna
    this.userProfile$ = this.authService.currentUser$.pipe(
      switchMap(user => user ? this.authService.getUserProfile(user.uid) : of(null))
    );
    // Mengambil jumlah notifikasi yang belum dibaca
    this.unreadCount$ = this.authService.currentUser$.pipe(
      switchMap(user => user ? this.notificationService.getUnreadCount(user.uid) : of(0))
    );
    // Mengambil 3 program terpopuler dari service
    this.popularPrograms$ = this.contentService.getPopularPrograms(3);
  }

  goToNotifications() {
    this.router.navigate(['/tabs/notifications']);
  }

  // FUNGSI INI DIPERBAIKI
   // Ganti fungsi navigateTo() Anda dengan yang ini
navigateTo(pageId: string) {
  switch (pageId) {
    case 'profile':
      this.router.navigate(['/tabs/tab2']);
      break;
      case 'campaign':
      this.router.navigate(['/tabs/tab3']);
      break;
    case 'program':
      this.router.navigate(['/tabs/tab4']);
      break;
    case 'ai':
      // PERBAIKI DI SINI: Alamatnya sekarang harus lengkap
      this.router.navigate(['/tabs/tab1/aibantuan']); 
      break;
    case 'news':
      // PERBAIKI DI SINI: Alamatnya sekarang harus lengkap
      this.router.navigate(['/tabs/tab1/berita']); 
      break;
    default:
      this.showAlert(`Halaman untuk "${pageId}" tidak ditemukan.`);
      break;
  }

}

  // FUNGSI INI DIPERBAIKI
  viewProgram(program: Program) {
    // Arahkan ke halaman detail program yang spesifik
    this.router.navigate(['/program-detail', program.id]);
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Helper untuk avatar inisial
  getInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map(p => p.charAt(0)).join('').toUpperCase();
  }
}
