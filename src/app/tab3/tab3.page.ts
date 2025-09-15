// src/app/tab3/tab3.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
   // --- FUNGSI BARU UNTUK SIMULASI DONASI ---
  async donate(campaign: Campaign, event: Event) {
    // Mencegah klik tembus ke kartu di belakangnya
    event.stopPropagation(); 

    try {
      // Panggil service untuk menjalankan simulasi
      await this.contentService.simulateDonation(campaign);
      this.presentToast('Terima kasih! Donasi Anda telah dicatat.');
    } catch (error) {
      console.error('Gagal melakukan donasi simulasi', error);
      this.presentToast('Gagal mencatat donasi. Coba lagi.');
    }
  }
  // --

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