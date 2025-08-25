// src/app/register/register.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: false, // <-- T
})
export class RegisterPage {
  // Variabel untuk menampung input dari form
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      // Jika berhasil, tampilkan notifikasi dan arahkan ke halaman login
      this.showAlert('Registrasi Berhasil!', 'Silakan login dengan akun baru Anda.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      // Jika gagal, tampilkan pesan error dari Firebase
      this.showAlert('Registrasi Gagal', error.message);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}