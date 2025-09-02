// src/app/edit-profile/edit-profile.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AuthService, UserProfile } from '../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false
})
export class EditProfilePage implements OnInit {

  profileForm: FormGroup;
  isLoading = true;
  private userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.profileForm = this.fb.group({
      namaLengkap: ['', Validators.required],
      sekolah: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      const user = await firstValueFrom(this.authService.currentUser$);
      if (user && user.uid) {
        // --- PERBAIKAN DI SINI ---
        const uid = user.uid; // Simpan ke variabel lokal dulu
        this.userId = uid;    // Baru simpan ke properti class

        // Gunakan variabel 'uid' yang sudah pasti string
        const profile = await firstValueFrom(this.authService.getUserProfile(uid) as Observable<UserProfile | null>);
        
        if (profile) {
          this.profileForm.patchValue({
            namaLengkap: profile.namaLengkap,
            sekolah: profile.sekolah
          });
        }
      }
    } catch (error) {
      console.error('Gagal memuat profil', error);
      this.presentToast('Gagal memuat data profil.');
    } finally {
      this.isLoading = false;
    }
  }

  async saveProfile() {
    if (!this.profileForm.valid || !this.userId) {
      this.presentToast('Nama Lengkap tidak boleh kosong.');
      return;
    }

    try {
      const formData = this.profileForm.value;
      await this.authService.updateUserProfile(this.userId, formData);
      
      this.presentToast('Profil berhasil diperbarui!');
      this.router.navigate(['/tabs/tab2']);

    } catch (error) {
      console.error('Gagal menyimpan profil', error);
      this.presentToast('Gagal menyimpan profil. Coba lagi.');
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