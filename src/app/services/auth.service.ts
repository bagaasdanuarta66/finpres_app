// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // <-- Pastikan ini ada
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   // TAMBAHKAN PROPERTI INI
  currentUser$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    // INISIALISASI PROPERTI DI DALAM CONSTRUCTOR
    this.currentUser$ = this.afAuth.authState;
  }

  // Fungsi untuk Register
  async register(email: string, password: string): Promise<any> {
    try {
      // Menggunakan fungsi bawaan Firebase untuk membuat user baru
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      // Melempar error agar bisa ditangkap di halaman register
      throw error;
    }
  }

  // Fungsi untuk Login
  async login(email: string, password: string): Promise<any> {
    try {
      // Menggunakan fungsi bawaan Firebase untuk login
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Fungsi untuk Logout
  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }
}