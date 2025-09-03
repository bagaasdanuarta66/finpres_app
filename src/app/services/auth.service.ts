// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Ganti import onAuthStateChanged dengan authState
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

export interface UserProfile {
  uid: string;
  email: string;
  namaLengkap?: string;
  sekolah?: string;
  photoURL?: string; // <-- Pastikan properti ini ada untuk fitur avatar
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Cukup satu baris ini untuk mendapatkan status user secara real-time
  currentUser$ = authState(this.auth);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  // FUNGSI INI DIPERBAIKI DENGAN TIPE KEMBALIAN
  getUserProfile(userId: string): Observable<UserProfile | null> {
    const ref = doc(this.firestore, 'users', userId);
    return docData(ref, { idField: 'id' }) as Observable<UserProfile | null>;
  }

  // HANYA ADA SATU FUNGSI UPDATE PROFIL
  async updateUserProfile(userId: string, data: any) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    try {
      return await updateDoc(userDocRef, data);
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e;
    }
  }
   async uploadAvatar(userId: string, cameraPhoto: Photo) {
    // Tentukan path penyimpanan di Firebase Storage (folder avatars, nama file = uid.webp)
    const path = `avatars/${userId}.webp`;
    const storageRef = ref(this.storage, path);

    try {
      // Upload gambar (yang sudah dalam format base64) ke Firebase Storage
      await uploadString(storageRef, cameraPhoto.base64String!, 'base64');

      // Dapatkan URL publik dari gambar yang baru di-upload
      const photoURL = await getDownloadURL(storageRef);

      // Simpan URL tersebut ke profil pengguna di Firestore menggunakan fungsi yang sudah ada
      return this.updateUserProfile(userId, { photoURL });

    } catch (e) {
      // Jika terjadi error, lemparkan agar bisa ditangani di halaman profil
      throw e;
    }
  }

  async register(email: string, password: string, profileData: any): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = result.user;
      if (user) {
        await setDoc(doc(this.firestore, 'users', user.uid), {
          email: user.email,
          namaLengkap: profileData.namaLengkap,
          sekolah: profileData.sekolah,
          poin: 0,
          createdAt: new Date()
        });
      }
      return result;
    } catch (error) {
      console.error('[AuthService] Register GAGAL.', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}