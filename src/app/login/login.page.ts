import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone:false,
})
export class LoginPage {
  // Variabel untuk menampung input dari form
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      // Jika berhasil, arahkan ke halaman utama aplikasi
      this.router.navigate(['/tabs/tab1']);
    } catch (error: any) {
      // Jika gagal, tampilkan pesan error dari Firebase
      this.showAlert('Login Gagal', 'Email atau password yang Anda masukkan salah.');
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