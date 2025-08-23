import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

// Interface dari kode Anda, ini sudah sangat bagus!
interface QuickAction {
  id: string;
  icon: string;
  title: string;
}

interface Program {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  participants: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  // Data untuk "Menu Utama"
  quickActions: QuickAction[] = [
    { id: 'campaign', icon: '💰', title: 'Campaign' },
    { id: 'program', icon: '🏆', title: 'Program Prestasi' },
    { id: 'ai', icon: '🤖', title: 'AI Bantuan' },
    { id: 'news', icon: '📰', title: 'Berita' }
  ];

  // Data untuk "Program Terpopuler"
  programs: Program[] = [
    {
      id: 'osn',
      icon: '🏆',
      title: 'Olimpiade Sains Nasional 2025',
      description: 'Persiapan intensif untuk OSN Matematika dan Fisika...',
      price: '500 Poin',
      participants: '1,234 siswa berpartisipasi'
    },
    {
      id: 'art',
      icon: '🎨',
      title: 'Workshop Digital Art',
      description: 'Belajar teknik digital art dan design grafis...',
      price: '300 Poin',
      participants: '567 siswa berpartisipasi'
    }
  ];

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // Logic inisialisasi bisa ditambahkan di sini
  }

  async showNotifications() {
    const alert = await this.alertController.create({
      header: 'Notifikasi',
      message: 'Anda memiliki 3 notifikasi baru.',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  // FUNGSI INI DIPERBAIKI
   // Ganti fungsi navigateTo() Anda dengan yang ini
navigateTo(pageId: string) {
  switch (pageId) {
    case 'campaign':
      this.router.navigate(['/tabs/tab2']);
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
  viewProgram(programId: string) {
    console.log(`Membuka program ${programId} di Tab 4`);
    // Langsung navigasi ke Tab 4 saat kartu program manapun diklik
    this.router.navigate(['/tabs/tab4']);
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
