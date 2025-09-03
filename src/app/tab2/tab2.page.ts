import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// Di bagian atas, bersama import lainnya
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs'; // <-- Import Observable
import { switchMap } from 'rxjs/operators'; // <-
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  
  // Variabel baru untuk menampung data profil
  userProfile$: Observable<any | null>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    public notificationService: NotificationService,
  
      private toastController: ToastController 
  ) {
    // Mengambil data profil berdasarkan status login
    this.userProfile$ = this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          // Jika user login, ambil profilnya dari Firestore
          return this.authService.getUserProfile(user.uid);
        } else {
          // Jika tidak login, kembalikan null
          return new Observable(sub => sub.next(null));
        }
      })
    );
  }
  
  ngOnInit() {}
   // --- TAMBAHKAN FUNGSI INI ---
  getInitials(namaLengkap: string | null | undefined): string {
    if (!namaLengkap) return '';
    // Mengambil 2 huruf pertama dari nama lengkap untuk inisial
    return namaLengkap.substring(0, 2).toUpperCase();
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

  async editAvatar() {
    console.log('1. Tombol editAvatar berhasil di-klik!');
    try {
      const user = await firstValueFrom(this.authService.currentUser$);
      
      if (!user) {
        console.log('2. Gagal karena tidak ada user yang login.');
        this.presentToast('Anda harus login untuk mengganti foto.');
        return;
      }

      console.log('3. User ditemukan. Akan memanggil Camera.getPhoto().');

      // Membuka pilihan Kamera atau Galeri Foto
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      console.log('4. Foto BERHASIL dipilih!', image);

      if (image) {
        await this.authService.uploadAvatar(user.uid, image);
        this.presentToast('Foto profil berhasil diperbarui!');
      }

    } catch (error) {
      console.error('5. TERJADI ERROR DI DALAM FUNGSI:', error);
      this.presentToast('Gagal memilih atau mengupload foto.');
    }
  }

    async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async openSettings() {
    const alert = await this.alertController.create({
      header: '⚙️ Pengaturan Aplikasi',
      message: '📱 Fitur yang tersedia:<br>• Tema aplikasi<br>• Bahasa<br>• Notifikasi push<br>• Privasi<br>• Tentang aplikasi',
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
 this.router.navigate(['/edit-profile']);
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
 const profile = await firstValueFrom(this.userProfile$);

    // Buat pesan dinamis menggunakan nama dan email dari profil
    // Menggunakan fallback 'Anda' jika namaLengkap tidak ada
    const message = `Apakah Anda yakin ingin keluar dari akun ${profile?.namaLengkap || 'Anda'} (${profile?.email || ''})?`;

    const alert = await this.alertController.create({
      header: '🚪 Konfirmasi Logout',
      message: message, // <-- Pesan dinamis digunakan di sini
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
              // Anda sudah punya fungsi showAlert, kita bisa pakai itu
              // this.showAlert('Logout Gagal. Silakan coba lagi.');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async myPrograms() {
    // Navigasi ke Tab 3
    this.router.navigateByUrl('/tabs/tab3');
  }

  async myCampaigns() {
    // Navigasi ke Tab 4
    this.router.navigateByUrl('/tabs/tab4');
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