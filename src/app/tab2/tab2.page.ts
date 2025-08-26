import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
// Di bagian atas, bersama import lainnya
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  constructor(
    // UBAH DARI 'private' MENJADI 'public'
    public authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  // TAMBAHKAN FUNGSI BARU INI
  // Fungsi untuk mengambil huruf pertama dari email sebagai inisial
  getInitials(email: string | null | undefined): string {
    if (!email) return '';
    return email.substring(0, 2).toUpperCase();
  }

  ngOnInit() {
    // Add any initialization logic here
  }

  navigateTo(page: string) {
    switch(page) {
      case 'home':
        this.router.navigate(['/tabs/tab1']);
        break;
      case 'profile':
        this.router.navigate(['/tabs/tab2']);
        break;
      case 'campaign':
        this.showAlert(`🚀 Navigasi ke halaman ${page}.\n\nDalam implementasi nyata, ini akan membuka halaman ${page}.`);
        break;
      case 'program':
        this.showAlert(`🚀 Navigasi ke halaman ${page}.\n\nDalam implementasi nyata, ini akan membuka halaman ${page}.`);
        break;
      default:
        this.showAlert(`🚀 Navigasi ke halaman ${page}.\n\nDalam implementasi nyata, ini akan membuka halaman ${page}.`);
        break;
    }
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async openSettings() {
    const alert = await this.alertController.create({
      header: '⚙️ Pengaturan Aplikasi',
      message: '📱 Fitur yang tersedia:<br>• Tema aplikasi<br>• Bahasa<br>• Notifikasi push<br>• Privasi<br>• Tentang aplikasi',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async editAvatar() {
    const alert = await this.alertController.create({
      header: '📷 Edit Avatar',
      message: 'Anda dapat:<br>• Ambil foto baru<br>• Pilih dari galeri<br>• Gunakan avatar default<br>• Tambah frame khusus',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async topUp() {
    const alert = await this.alertController.create({
      header: '💳 Top Up Saldo',
      message: 'Metode pembayaran:<br>• Transfer bank<br>• E-wallet (OVO, Dana, GoPay)<br>• Virtual account<br>• Kartu kredit/debit',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async viewHistory() {
    const alert = await this.alertController.create({
      header: '📊 Riwayat Transaksi',
      message: 'Melihat semua aktivitas:<br>• Transaksi masuk/keluar<br>• Penggunaan poin<br>• Reward yang diterima<br>• Export laporan',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async convertPoints() {
    const alert = await this.alertController.create({
      header: '🔄 Konversi Poin',
      message: '💡 Tukarkan poin dengan:<br>• Saldo uang<br>• Voucher belanja<br>• Merchandise Sakuma<br>• Akses program premium',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async usePoints() {
    const alert = await this.alertController.create({
      header: '⭐ Gunakan Poin',
      message: 'Gunakan poin untuk:<br>• Daftar program premium<br>• Beli merchandise<br>• Unlock fitur khusus<br>• Donasi ke campaign',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async viewPrograms() {
    const alert = await this.alertController.create({
      header: '🏆 Program Selesai',
      message: 'Anda telah menyelesaikan 15 program dengan tingkat kelulusan 89%',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async viewPoints() {
    const alert = await this.alertController.create({
      header: '⭐ Total Poin',
      message: 'Total poin yang dikumpulkan: 2,340 poin',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async viewStats() {
    const alert = await this.alertController.create({
      header: '📈 Statistik',
      message: 'Tingkat kelulusan: 89%<br>Peringkat: Top 15%<br>Konsistensi: Sangat Baik',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async viewAchievement(achievement: string) {
    const alert = await this.alertController.create({
      header: '🏅 Achievement',
      message: `Detail pencapaian: ${achievement}`,
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async editProfile() {
    const alert = await this.alertController.create({
      header: '✏️ Edit Profile',
      message: 'Ubah informasi:<br>• Nama lengkap<br>• Sekolah/universitas<br>• Bio singkat<br>• Kontak darurat<br>• Minat dan hobi',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async notifications() {
    const alert = await this.alertController.create({
      header: '🔔 Pengaturan Notifikasi',
      message: 'Kustomisasi notifikasi:<br>• Program baru<br>• Update campaign<br>• Reminder deadline<br>• Achievement unlock',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async security() {
    const alert = await this.alertController.create({
      header: '🔒 Keamanan Akun',
      message: 'Fitur keamanan:<br>• Ubah password<br>• Two-factor authentication<br>• Riwayat login<br>• Perangkat terpercaya',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async help() {
    const alert = await this.alertController.create({
      header: '❓ Pusat Bantuan',
      message: 'Dukungan tersedia:<br>• FAQ lengkap<br>• Live chat support<br>• Video tutorial<br>• Hubungi customer service',
      buttons: ['Tutup']
    });
    await alert.present();
  }

async logout() {
    const alert = await this.alertController.create({
      header: '🚪 Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari akun Sakuma?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: async () => {
            try {
              await this.authService.logout();
              this.router.navigate(['/login'], { replaceUrl: true });
              console.log('Pengguna berhasil logout dari Firebase!');
            } catch (error) {
              console.error('Gagal logout', error);
              this.showAlert('Logout Gagal. Silakan coba lagi.');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async myPrograms() {
    const alert = await this.alertController.create({
      header: '🏆 Program Saya',
      message: 'Kelola program:<br>• Program yang sedang diikuti<br>• Progress dan deadline<br>• Hasil dan sertifikat<br>• Riwayat program selesai',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async myCampaigns() {
    const alert = await this.alertController.create({
      header: '💰 Campaign Saya',
      message: 'Kelola campaign:<br>• Campaign yang dibuat<br>• Donasi yang diberikan<br>• Progress funding<br>• Update dan laporan',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async savedItems() {
    const alert = await this.alertController.create({
      header: '❤️ Item Tersimpan',
      message: 'Koleksi favorit:<br>• Program yang disimpan<br>• Campaign bookmark<br>• Artikel menarik<br>• Video tutorial',
      buttons: ['Tutup']
    });
    await alert.present();
  }
}