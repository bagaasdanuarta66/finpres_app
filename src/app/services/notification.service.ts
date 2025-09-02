// src/app/services/notification.service.ts

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc, query, where, orderBy, limit, addDoc, serverTimestamp, collectionData, getDocs } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface NotificationItem {
  id?: string;
  uid: string;          // owner user id
  title: string;
  message?: string;
  read: boolean;
  createdAt: any;       // Firestore Timestamp or Date
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Menggunakan inject() untuk konsistensi dengan API modern
  private firestore: Firestore = inject(Firestore);
  private http: HttpClient = inject(HttpClient);

  // Kunci server FCM Anda dari Firebase Console
  // PENTING: Untuk keamanan, sebaiknya simpan ini di environment variables, bukan di kode.
  private serverKey = 'AAAAYdaxf9Q:APA91bFcG-T0v6JNCb4wVjhpkEWpE-4AOFp182f_g1kH6G51IFnpgpD5V-eYVf-6Q1Y0dZ_V_r5B-25f0y39uL45-xY6XbE3_LzJ3I7P5oU1-T0v6kF3kM1wI8bE7aD3c';


  // ===================================================================
  // BAGIAN BARU: UNTUK MENGIRIM PUSH NOTIFICATION (FCM) KE SEMUA PENGGUNA
  // ===================================================================

  /**
   * Mengirim Push Notification ke semua pengguna yang memiliki FCM Token.
   */
  sendNotificationToAll(title: string, body: string): Observable<any> {
    return from(this.getAllFCMTokens()).pipe(
      switchMap(tokens => {
        if (tokens.length === 0) {
          console.warn('Tidak ada token FCM yang ditemukan untuk dikirimi notifikasi.');
          return of({ success: false, message: 'No FCM tokens found.' });
        }
        const notificationData = {
          registration_ids: tokens,
          notification: { title, body, sound: 'default' }
        };
        const headers = {
          'Authorization': `key=${this.serverKey}`,
          'Content-Type': 'application/json'
        };
        return this.http.post('https://fcm.googleapis.com/fcm/send', notificationData, { headers });
      })
    );
  }

  /**
   * Mengambil semua FCM token dari koleksi 'users' di Firestore.
   */
  private async getAllFCMTokens(): Promise<string[]> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('fcmToken', '!=', null));
    const querySnapshot = await getDocs(q);
    const tokens: string[] = [];
    querySnapshot.forEach(document => {
      const data = document.data();
      if (data && data['fcmToken']) {
        tokens.push(data['fcmToken']);
      }
    });
    return tokens;
  }


  // ==========================================================
  // BAGIAN LAMA: FUNGSI UNTUK NOTIFIKASI DI DALAM APLIKASI
  // (Kode Anda sebelumnya, tidak diubah)
  // ==========================================================

  getUserNotifications(uid: string, max: number = 20): Observable<NotificationItem[]> {
    const ref = collection(this.firestore, 'notifications');
    const q = query(ref, where('uid', '==', uid), orderBy('createdAt', 'desc'), limit(max));
    return collectionData(q, { idField: 'id' }) as Observable<NotificationItem[]>;
  }

  getUnreadCount(uid: string): Observable<number> {
    const ref = collection(this.firestore, 'notifications');
    const q = query(ref, where('uid', '==', uid), where('read', '==', false));
    return new Observable<number>((subscriber) => {
      const sub = collectionData(q).subscribe({
        next: (arr: any[]) => subscriber.next(arr.length),
        error: (e) => subscriber.error(e)
      });
      return () => sub.unsubscribe();
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    const ref = doc(this.firestore, 'notifications', notificationId);
    await updateDoc(ref, { read: true });
  }

  async markAllAsRead(items: NotificationItem[]): Promise<void> {
    const ops = items
      .filter(n => !n.read && n.id)
      .map(n => updateDoc(doc(this.firestore, 'notifications', n.id!), { read: true }));
    await Promise.all(ops);
  }

  async addNotification(uid: string, title: string, message?: string): Promise<void> {
    const ref = collection(this.firestore, 'notifications');
    await addDoc(ref, {
      uid,
      title,
      message: message || null,
      read: false,
      createdAt: serverTimestamp()
    });
  }
}