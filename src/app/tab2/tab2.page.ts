import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// Di bagian atas, bersama import lainnya
import { AuthService } from '../services/auth.service';
import { ContentService } from '../services/content.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators'; // <-
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ThemeService } from '../services/theme.service'; // Sesuaikan path jika perlu


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  
  // Variabel baru untuk menampung data profil
  userProfile$: Observable<any | null>;
   myPrograms$: Observable<any[]>;
     myCampaigns$!: Observable<any[]>;
       completedProgramsCount$!: Observable<number>;

     

  constructor(
    public themeService: ThemeService,
    public authService: AuthService,
     private contentService: ContentService,
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
     this.myPrograms$ = this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          // Jika ada pengguna login, panggil fungsi baru dari contentService
          return this.contentService.getRegisteredProgramsForUser(user.uid);
        } else {
          // Jika tidak ada pengguna, kembalikan array kosong
          return of([]);
        }
      })
    );
    this.myCampaigns$ = this.authService.currentUser$.pipe(
    switchMap(user => {
      if (user) {
        // Jika ada pengguna login, panggil fungsi dari contentService
        return this.contentService.getCampaignsForUser(user.uid);
      } else {
        // Jika tidak ada pengguna, kembalikan array kosong
        return of([]);
      }
    })
  );
  this.completedProgramsCount$ = this.authService.currentUser$.pipe(
    switchMap(user => {
      if (user) {
        // Jika user login, panggil fungsi baru dari service
        return this.contentService.getCompletedProgramsCount(user.uid);
      } else {
        // Jika tidak login, kembalikan angka 0
        return of(0);
      }
    })
  );
  
  }
  
  toggleTheme() {
  this.themeService.toggleTheme();
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

  

// Di dalam class Tab2Page di file tab2.page.ts

// Tambahkan fungsi baru ini
scrollToSettings() {
  // Cari elemen dengan id 'pengaturan'
  const settingsEl = document.getElementById('pengaturan');

  // Jika elemen ditemukan, scroll ke sana dengan animasi halus
  if (settingsEl) {
    settingsEl.scrollIntoView({ behavior: 'smooth' });
  }
}
  // TAMBAHKAN FUNGSI BARU INI
  async showTopUpPrompt() {
    const alert = await this.alertController.create({
      header: 'Isi Saldo',
      message: 'Masukkan jumlah saldo yang ingin ditambahkan.',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Contoh: 50000',
          min: 1000
        }
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'OK',
          handler: async (data) => {
            const amount = parseInt(data.amount, 10);
            if (isNaN(amount) || amount <= 0) {
              this.presentToast('Jumlah tidak valid.');
              return;
            }

            const user = await firstValueFrom(this.authService.currentUser$);
            if (!user) return;

            try {
              await this.authService.topUpSaldo(user.uid, amount);
              this.presentToast('Saldo berhasil ditambahkan!');
            } catch (error) {
              console.error('Gagal top up:', error);
              this.presentToast('Gagal menambahkan saldo.');
            }
          }
        }
      ]
    });

    await alert.present();
  }
 


  async viewHistory() {
    const alert = await this.alertController.create({
      header: '📊 Riwayat Transaksi',
      message: 'Melihat semua aktivitas',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async convertPoints() {
    const alert = await this.alertController.create({
      header: '🔄 Konversi Poin',
      message: '💡 Tukarkan poin dengan saldo uang',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async usePoints() {
    const alert = await this.alertController.create({
      header: '⭐ Gunakan Poin',
      message: 'Gunakan poin untuk Donasi ke campaign',
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
  // 1. Ambil data profil terbaru dari observable
  const profile = await firstValueFrom(this.userProfile$);
  // 2. Siapkan nilai poin (atau 0 jika profil belum termuat)
  const userPoints = profile ? profile.poin : 0;

  const alert = await this.alertController.create({
    header: '⭐ Total Poin',
    // 3. Gunakan data dinamis di sini dengan template literal (``)
    message: `Total poin yang dikumpulkan: ${userPoints.toLocaleString('id-ID')} poin`,
    buttons: ['Tutup']
  });
  await alert.present();
}

  async viewStats() {
    const alert = await this.alertController.create({
      header: '📈 Statistik',
      message: 'Tingkat kelulusan Sangat Baik',
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
      message: 'Fitur keamanan: Perangkat terpercaya',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async help() {
  // Mengarahkan pengguna ke halaman help-center
  this.router.navigate(['/help-center']);
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
    this.router.navigateByUrl('/tabs/tab4');
  }

  async myCampaigns() {
    // Navigasi ke Tab 4
    this.router.navigateByUrl('/tabs/tab3');
  }

  
  // --- TAMBAHKAN FUNGSI BARU INI ---
  goToAddTransactionPage() {
    this.router.navigate(['/pages/add-transaction']);
  }
  async showKonversiPrompt() {
  // Ambil data user terkini untuk mendapatkan jumlah poin
  const user = await firstValueFrom(this.authService.currentUser$);
  if (!user) return;
  const currentPoints = (user as any)['poin'] || 0;

  const alert = await this.alertController.create({
    header: 'Konversi Poin',
    message: `Poin Anda saat ini: ${currentPoints}. Masukkan jumlah poin yang ingin dikonversi ke saldo (1 Poin = Rp 1).`,
    inputs: [
      {
        name: 'points',
        type: 'number',
        placeholder: `Maks: ${currentPoints}`,
        min: 1,
        max: currentPoints
      }
    ],
    buttons: [
      { text: 'Batal', role: 'cancel' },
      {
        text: 'Konversi',
        handler: async (data) => {
          const points = parseInt(data.points, 10);
          if (isNaN(points) || points <= 0) {
            this.presentToast('Jumlah poin tidak valid.');
            return;
          }

          try {
            await this.authService.konversiPoin(user.uid, points);
            this.presentToast('Poin berhasil dikonversi ke saldo!');
          } catch (error: any) {
            console.error('Gagal konversi:', error);
            // Menampilkan pesan error dari service, misal "Poin tidak mencukupi"
            this.presentToast(error.message || 'Gagal melakukan konversi.');
          }
        }
      }
    ]
  });

  await alert.present();
}
}