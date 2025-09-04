// src/app/pages/add-campaign/add-campaign.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom, Observable } from 'rxjs'; // <-- Observable ditambahkan di import
import { AuthService, UserProfile } from '../../services/auth.service'; // <-- UserProfile di-import
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.page.html',
  styleUrls: ['./add-campaign.page.scss'],
  standalone: false,
})
export class AddCampaignPage implements OnInit {

  campaignForm: FormGroup;
  selectedPhoto: Photo | null = null;
  selectedImageData: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.campaignForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      targetDana: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      if (image) {
        this.selectedPhoto = image;
        this.selectedImageData = `data:image/${image.format};base64,${image.base64String}`;
      }
    } catch (error) {
      console.error('Gagal memilih gambar', error);
      this.presentToast('Gagal memilih gambar.');
    }
  }

  async saveCampaign() {
    if (this.campaignForm.invalid) {
      this.presentToast('Harap isi semua kolom dengan benar.');
      return;
    }

    try {
      const user = await firstValueFrom(this.authService.currentUser$);
      if (!user) {
        this.presentToast('Gagal mendapatkan data pengguna. Silakan login ulang.');
        return;
      }
      
      // PERBAIKAN DI BARIS INI
      const profile = await firstValueFrom(this.authService.getUserProfile(user.uid) as Observable<UserProfile | null>);

      if (!profile) {
        this.presentToast('Gagal mendapatkan data profil pengguna.');
        return;
      }

      let imageUrl = '';
      if (this.selectedPhoto) {
        imageUrl = await this.authService.uploadImage(this.selectedPhoto, 'campaigns');
      }

      const formData = this.campaignForm.value;
      const campaignData = {
        ...formData,
        creatorName: profile.namaLengkap,
        imageUrl: imageUrl, 
      };

      await this.authService.addCampaign(user.uid, campaignData);

      this.presentToast('Campaign berhasil dipublikasikan!');
      this.router.navigate(['/tabs/tab3']);

    } catch (error) {
      console.error('Gagal menyimpan campaign', error);
      this.presentToast('Gagal mempublikasikan campaign. Coba lagi.');
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
}