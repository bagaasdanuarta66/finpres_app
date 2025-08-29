// src/app/services/notification.service.ts

import { Injectable } from '@angular/core';
import { Firestore, collection, doc, updateDoc, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface NotificationItem {
  id?: string;
  uid: string;            // owner user id
  title: string;
  message?: string;
  read: boolean;
  createdAt: any;         // Firestore Timestamp or Date
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private firestore: Firestore) {}

  // Stream all notifications for user (latest first)
  getUserNotifications(uid: string, max: number = 20): Observable<NotificationItem[]> {
    const ref = collection(this.firestore, 'notifications');
    const q = query(ref, where('uid', '==', uid), orderBy('createdAt', 'desc'), limit(max));
    return collectionData(q, { idField: 'id' }) as Observable<NotificationItem[]>;
  }

  // Stream unread count for user
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

  // Mark single notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const ref = doc(this.firestore, 'notifications', notificationId);
    await updateDoc(ref, { read: true });
  }

  // Mark all read for a user (client-side loop)
  async markAllAsRead(items: NotificationItem[]): Promise<void> {
    const ops = items
      .filter(n => !n.read && n.id)
      .map(n => updateDoc(doc(this.firestore, 'notifications', n.id!), { read: true }));
    await Promise.all(ops);
  }

  // Create a new notification for a user
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
