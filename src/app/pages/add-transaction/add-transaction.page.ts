// src/app/pages/add-transaction/add-transaction.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.page.html',
  styleUrls: ['./add-transaction.page.scss'],
  standalone: false,
})
export class AddTransactionPage implements OnInit {

  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    // Inisialisasi form dengan validasi
    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  async saveTransaction() {
    if (this.transactionForm.invalid) {
      this.presentToast('Harap isi semua kolom dengan benar.');
      return;
    }

    try {
      const user = await firstValueFrom(this.authService.currentUser$);
      if (!user) {
        this.presentToast('Anda harus login untuk menambah transaksi.');
        return;
      }

      const formData = this.transactionForm.value;
      // Panggil service yang sudah kita buat untuk menyimpan data
      await this.authService.addTransaction(user.uid, formData);

      this.presentToast('Transaksi berhasil disimpan!');
      // Arahkan pengguna kembali ke halaman aktivitas
      this.router.navigate(['/tabs/tab2']);

    } catch (error) {
      console.error('Gagal menyimpan transaksi', error);
      this.presentToast('Gagal menyimpan transaksi. Coba lagi.');
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