import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs'; // <-- 1. TAMBAHKAN IMPORT INI

@Component({
  selector: 'app-notification-sender',
  templateUrl: './notification-sender.page.html',
  styleUrls: ['./notification-sender.page.scss'],
  standalone: false,
})
export class NotificationSenderPage {

  notificationTitle: string = '';
  notificationMessage: string = '';

  constructor(
    private afs: AngularFirestore,
    private alertController: AlertController
  ) { }

  async sendNotificationToAllUsers() {
    if (!this.notificationTitle || !this.notificationMessage) {
      this.showAlert('Error', 'Judul dan isi pesan tidak boleh kosong.');
      return;
    }

    try {
      // 2. UBAH BARIS DI BAWAH INI
      // dari: const usersSnapshot = await this.afs.collection('users').get().toPromise();
      // menjadi:
      const usersSnapshot = await firstValueFrom(this.afs.collection('users').get());
      
      if (!usersSnapshot || usersSnapshot.empty) {
        this.showAlert('Info', 'Tidak ada pengguna yang terdaftar.');
        return;
      }

      const batch = this.afs.firestore.batch();

      usersSnapshot.forEach(userDoc => {
        const userId = userDoc.id;
        const notificationRef = this.afs.collection('notifications').doc().ref;
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