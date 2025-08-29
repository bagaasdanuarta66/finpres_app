// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<any | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Buat observable auth state secara manual agar tidak bergantung compat API
    this.currentUser$ = new Observable((subscriber) => {
      const unsub = onAuthStateChanged(this.auth, (user) => subscriber.next(user), (err) => subscriber.error(err));
      return () => unsub();
    });
  }
  // Fungsi untuk mengambil satu dokumen profil pengguna dari Firestore
  getUserProfile(userId: string) {
    const ref = doc(this.firestore, 'users', userId);
    return docData(ref, { idField: 'id' });
  }

  // 3. UBAH FUNGSI REGISTER MENJADI SEPERTI INI
  async register(email: string, password: string, profileData: any): Promise<any> {
    try {
      // Langkah 1: Buat akun di Authentication
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = result.user;

      if (user) {
        console.log('[AuthService] Akan menulis profil ke Firestore:', {
          path: `users/${user.uid}`,
          email: user.email,
          profileData
        });
        // Langkah 2: Buat dokumen profil di Firestore
        // Dokumen ini akan disimpan di collection 'users' dengan ID yang sama dengan ID user
        await setDoc(doc(this.firestore, 'users', user.uid), {
          email: user.email,
          namaLengkap: profileData.namaLengkap,
          sekolah: profileData.sekolah,
          poin: 0,
          createdAt: new Date()
        });
        console.log('[AuthService] Penulisan profil ke Firestore BERHASIL untuk uid:', user.uid);
      }
      return result;
    } catch (error) {
      console.error('[AuthService] Register GAGAL. Detail error dari Firebase/Firestore:', error);
      throw error;
    }
  }

  // Fungsi login dan logout tetap sama, tidak perlu diubah
  async login(email: string, password: string): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}