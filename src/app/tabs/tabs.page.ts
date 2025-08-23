// tabs/tabs.page.ts
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    const alert = await this.alertController.create({
      header: '📱 QR Scanner',
      message: 'Fitur scan QR untuk transaksi cepat.\n\nSilakan arahkan kamera ke QR code yang valid.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Buka Kamera',
          handler: () => {
            console.log('Opening QR Scanner...');
            this.showAlert('📱 Membuka kamera QR Scanner...');
          }
        }
      ]
    });
    await alert.present();
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