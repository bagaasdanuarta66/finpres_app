// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // <-- 1. IMPORT INI
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<firebase.User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore // <-- 2. INJECT INI
  ) {
    this.currentUser$ = this.afAuth.authState;
  }
  // Fungsi untuk mengambil satu dokumen profil pengguna dari Firestore
  getUserProfile(userId: string) {
    return this.afs.doc<any>(`users/${userId}`).valueChanges();
  }

  // 3. UBAH FUNGSI REGISTER MENJADI SEPERTI INI
  async register(email: string, password: string, profileData: any): Promise<any> {
    try {
      // Langkah 1: Buat akun di Authentication
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = result.user;

      if (user) {
        // Langkah 2: Buat dokumen profil di Firestore
        // Dokumen ini akan disimpan di collection 'users' dengan ID yang sama dengan ID user
        await this.afs.doc(`users/${user.uid}`).set({
          email: user.email,
          namaLengkap: profileData.namaLengkap,
          sekolah: profileData.sekolah,
          poin: 0, // Beri poin awal saat mendaftar
          createdAt: new Date()
        });
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Fungsi login dan logout tetap sama, tidak perlu diubah
  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }
}