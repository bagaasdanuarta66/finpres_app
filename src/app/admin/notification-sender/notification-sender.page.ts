// src/app/admin/send-notification/notification-sender.page.ts

import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

// 1. IMPORT DIUBAH: Gunakan dari '@angular/fire/firestore'
import { Firestore, collection, getDocs, writeBatch, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-notification-sender',
  templateUrl: './notification-sender.page.html',
  styleUrls: ['./notification-sender.page.scss'],
  standalone: false,
})
export class NotificationSenderPage {

  notificationTitle: string = '';
  notificationMessage: string = '';

  // 2. CONSTRUCTOR DIUBAH: Minta 'Firestore', bukan 'AngularFirestore'
  constructor(
    private firestore: Firestore, // <-- DIUBAH
    private alertController: AlertController
  ) { }

  async sendNotificationToAllUsers() {
    if (!this.notificationTitle || !this.notificationMessage) {
      this.showAlert('Error', 'Judul dan isi pesan tidak boleh kosong.');
      return;
    }

    try {
      // 3. CARA MENGAMBIL DATA DIUBAH
      const usersCollectionRef = collection(this.firestore, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);

      if (!usersSnapshot || usersSnapshot.empty) {
        this.showAlert('Info', 'Tidak ada pengguna yang terdaftar.');
        return;
      }

      // 4. CARA MEMBUAT BATCH DIUBAH
      const batch = writeBatch(this.firestore);
      const notificationsCollectionRef = collection(this.firestore, 'notifications');

      usersSnapshot.forEach(userDoc => {
        const userId = userDoc.id;

        // 5. CARA MEMBUAT REFERENSI DOKUMEN BARU DIUBAH
        const notificationRef = doc(notificationsCollectionRef); // Membuat doc baru dengan ID otomatis
        
        const newNotification = {
          uid: userId,
          title: this.notificationTitle,
          message: this.notificationMessage,
          read: false,
          createdAt: new Date()
        };
        batch.set(notificationRef, newNotification);
      });

      await batch.commit();
      
      this.showAlert('Sukses', `Notifikasi berhasil dikirim ke ${usersSnapshot.size} pengguna.`);
      this.notificationTitle = '';
      this.notificationMessage = '';

    } catch (error) {
      console.error("Error sending notifications:", error);
      this.showAlert('Gagal', 'Terjadi kesalahan saat mengirim notifikasi.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}