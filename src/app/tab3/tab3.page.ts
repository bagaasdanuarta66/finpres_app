// src/app/tab3/tab3.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Firestore, collection, query, orderBy, collectionData } from '@angular/fire/firestore';
import { AlertController,ToastController } from '@ionic/angular';
import { ContentService, Campaign } from '../services/content.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  // Kita akan ambil semua campaign dari Firestore
  public campaigns$: Observable<any[]>;

  // Variabel untuk filter (akan kita fungsikan lebih lanjut nanti)
  activeFilter = 'semua';

  constructor(
    private router: Router,
   public authService: AuthService,
       private contentService: ContentService, // <-- 3. Suntikkan ContentService
 // <-- Dibuat 'public' agar bisa diakses dari HTML
    private firestore: Firestore,
    private alertController: AlertController,
    private toastController: ToastController // Untuk fungsi placeholder
  ) {
    // Ambil data dari koleksi 'campaigns', urutkan dari yang terbaru
    const campaignsRef = collection(this.firestore, 'campaigns');
    const q = query(campaignsRef, orderBy('createdAt', 'desc'));
    this.campaigns$ = collectionData(q, { idField: 'id' });
  }

  // Fungsi filter, untuk saat ini hanya mengubah tampilan tombol
  filterCampaigns(category: string) {
    this.activeFilter = category;
    // Logika filter data dari Firestore akan kita tambahkan nanti
  }
  
  // Fungsi untuk membuat campaign (akan kita buat halamannya nanti)
  async createCampaign() {
    this.router.navigate(['/pages/add-campaign']); // Kita akan buat halaman ini
  }
   // Di dalam file tab3.page.ts

// GANTI FUNGSI 'donate' YANG LAMA DENGAN INI
async donateWithPoints(campaign: any) {
  const alert = await this.alertController.create({
    header: 'Donasi dengan Poin',
    message: `Masukkan jumlah poin yang ingin Anda donasikan ke campaign "${campaign.title}".`,
    inputs: [
      {
        name: 'points',
        type: 'number',
        placeholder: 'Contoh: 100',
        min: 1
      },
    ],
    buttons: [
      {
        text: 'Batal',
        role: 'cancel',
      },
      {
        text: 'Donasi',
        handler: async (data) => {
          const pointsToDonate = parseInt(data.points, 10);
          if (isNaN(pointsToDonate) || pointsToDonate <= 0) {
            this.presentToast('Jumlah poin tidak valid.');
            return;
          }

          const user = await firstValueFrom(this.authService.currentUser$);
          if (!user) {
            this.presentToast('Anda harus login untuk berdonasi.');
            return;
          }

          try {
            await this.contentService.donateWithPoints(campaign.id, user.uid, pointsToDonate);
            this.presentToast('Terima kasih! Donasi poin Anda berhasil.');
          } catch (error: any) {
            console.error('Gagal donasi poin:', error);
            // Menampilkan pesan error yang lebih spesifik dari service
            this.presentToast(error.message || 'Terjadi kesalahan.');
          }
        },
      },
    ],
  });

  await alert.present();
}

   // --- TAMBAHKAN FUNGSI BARU INI UNTUK KONFIRMASI HAPUS ---
  async confirmDeleteCampaign(campaign: any) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus campaign "${campaign.title}"?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          handler: async () => {
            try {
              await this.authService.deleteCampaign(campaign.id);
              this.presentToast('Campaign berhasil dihapus.');
            } catch (error) {
              console.error('Gagal menghapus campaign', error);
              this.presentToast('Gagal menghapus campaign. Coba lagi.');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Fungsi helper untuk notifikasi
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

}