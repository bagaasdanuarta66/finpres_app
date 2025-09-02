// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData, updateDoc } from '@angular/fire/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  namaLengkap?: string;
  sekolah?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<any | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.currentUser$ = new Observable((subscriber) => {
      const unsub = onAuthStateChanged(this.auth, (user) => subscriber.next(user));
      return () => unsub();
    });
  }

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