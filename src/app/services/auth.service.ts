// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

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