import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

interface Campaign {
  id: string;
  title: string;
  category: string;
  trending?: boolean;
  urgent?: boolean;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {

  activeFilter = 'semua';
  campaigns: Campaign[] = [
    { id: 'festival-sains', title: 'Festival Sains SMA Negeri 1 Jakarta', category: 'sekolah', trending: true },
    { id: 'air-bersih', title: 'Proyek Penelitian Air Bersih', category: 'sains' },
    { id: 'teater', title: 'Pentas Teater "Pahlawan Nusantara"', category: 'seni' },
    { id: 'banjir', title: 'Bantuan Korban Banjir Jakarta', category: 'sosial', urgent: true }
  ];

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // Add any initialization logic here
  }

  filterCampaigns(category: string) {
    this.activeFilter = category;
  }

  shouldShowCampaign(category: string): boolean {
    if (this.activeFilter === 'semua') return true;
    if (this.activeFilter === 'trending') {
      const campaign = this.campaigns.find(c => c.category === category);
      return campaign?.trending || false;
    }
    return this.activeFilter === category;
  }

  searchCampaigns(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
  }

  async createCampaign() {
    const alert = await this.alertController.create({
      header: '🚀 Buat Campaign',
      message: 'Form pembuatan campaign akan dibuka!<br><br>Anda dapat membuat campaign untuk:<br>• Kegiatan sekolah<br>• Proyek sosial<br>• Penelitian<br>• Event seni budaya',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  async viewCampaign(campaignId: string) {
    const campaigns = {
      'festival-sains': 'Festival Sains SMA Negeri 1 Jakarta',
      'air-bersih': 'Proyek Penelitian Air Bersih',
      'teater': 'Pentas Teater "Pahlawan Nusantara"',
      'banjir': 'Bantuan Korban Banjir Jakarta'
    };
    
    const alert = await this.alertController.create({
      header: '📋 Detail Campaign',
      message: `${campaigns[campaignId as keyof typeof campaigns]}<br><br>Anda akan melihat:<br>• Informasi lengkap<br>• Cara berdonasi<br>• Update progress<br>• Testimoni donatur`,
      buttons: ['Tutup']
    });
    await alert.present();
  }

  navigateTo(page: string) {
    switch(page) {
      case 'home':
        this.router.navigate(['/tabs/tab1']);
        break;
      case 'profile':
        this.router.navigate(['/tabs/tab2']);
        break;
      default:
        this.showAlert(`🚀 Navigasi ke halaman ${page}.\n\nDalam implementasi nyata, ini akan membuka halaman ${page}.`);
        break;
    }
  }

  async scanQR() {
    const alert = await this.alertController.create({
      header: 'Scan QR Code',
      message: '📱 Fitur scan QR untuk donasi cepat',
      buttons: ['Tutup']
    });
    await alert.present();
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}