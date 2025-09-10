// tabs/tabs.page.ts
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,  // Eksplisit seperti tab1
})
export class TabsPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialization logic jika diperlukan
  }

  async scanQR() {
    try {
      // Beri umpan balik awal agar pengguna tahu klik terdeteksi
      await this.showAlert('Membuka kamera...');

      const platform = Capacitor.getPlatform();

      // Cek izin kamera sesuai platform
      const perm = await Camera.checkPermissions();
      if (perm.camera !== 'granted') {
        const req = await Camera.requestPermissions();
        if (req.camera !== 'granted') {
          throw new Error('Izin kamera ditolak. Buka pengaturan aplikasi/peramban lalu izinkan kamera.');
        }
      }

      // Validasi khusus web: harus secure context (https/localhost) dan ada perangkat kamera
      if (platform === 'web') {
        // Pastikan secure context
        const isSecure = window.isSecureContext || window.location.hostname === 'localhost';
        if (!isSecure) {
          throw new Error('Browser membutuhkan HTTPS atau localhost untuk mengakses kamera. Jalankan di https atau gunakan perangkat.');
        }

        // Coba cek ketersediaan kamera
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Perangkat kamera tidak tersedia di browser ini. Coba browser lain atau gunakan perangkat.');
        }
      }

      // Langsung buka kamera
      const photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      // Lakukan sesuatu dengan hasil foto jika diperlukan
      // Contoh: tampilkan notifikasi sukses
      await this.showAlert('\uD83D\uDCF7 Kamera terbuka dan foto berhasil diambil.');

      // Jika Anda ingin menavigasi ke halaman pratinjau, lakukan di sini
      // this.router.navigate(['/preview'], { state: { photo } });
    } catch (err: any) {
      // Pengguna mungkin membatalkan atau izin ditolak
      console.warn('Camera action cancelled or failed', err);
      // Tampilkan pesan agar pengguna tahu apa yang terjadi
      const msg = typeof err?.message === 'string' ? err.message : 'Tidak dapat membuka kamera. Pastikan izin kamera diberikan dan coba lagi.';
      await this.showAlert(msg);
    }
  }

  async openProfile() {
    // Navigate langsung ke tab2 (Profile)
    this.router.navigate(['/tabs/tab2']);
  }

  // Method untuk navigasi Program (karena tidak ada tab4)
  async navigateToProgram() {
    const alert = await this.alertController.create({
      header: '🏆 Program',
      message: 'Fitur Program akan segera tersedia!\n\nSementara ini Anda bisa akses program melalui menu di beranda.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Kembali ke tab1 (Beranda)
            this.router.navigate(['/tabs/tab1']);
          }
        }
      ]
    });
    await alert.present();
  }

  // Helper method untuk menampilkan alert
  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Method untuk navigasi jika diperlukan dari navbar
  navigateToTab(tab: string) {
    this.router.navigate([`/tabs/${tab}`]);
  }
}