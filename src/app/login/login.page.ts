import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: false,
})
export class LoginPage { // <-- Class dimulai di sini
  // Variabel untuk menampung input dari form
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  // Fungsi login HARUS ada di dalam class ini
  async login() {
    // Mata-mata #1: Untuk memastikan tombolnya berfungsi
    console.log('Tombol login diklik! Mencoba login dengan email:', this.email);

    try {
      const response = await this.authService.login(this.email, this.password);
      
      // Mata-mata #2: Untuk memastikan login ke Firebase berhasil
      console.log('Login ke Firebase BERHASIL!', response);
      
      // Arahkan ke halaman utama aplikasi
      this.router.navigate(['/tabs/tab1']);

    } catch (error: any) {
      // Mata-mata #3: Untuk melihat error apa yang dikembalikan Firebase
      console.error('Login GAGAL! Error dari Firebase:', error);
      
      // Memanggil fungsi showAlert yang ada di dalam class yang sama
      this.showAlert('Login Gagal', 'Email atau password yang Anda masukkan salah.');
    }
  }

  // Fungsi showAlert juga HARUS ada di dalam class ini
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

} // <-- Kurung kurawal penutup class ada di paling akhir