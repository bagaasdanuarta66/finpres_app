// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, firstValueFrom } from 'rxjs'; // 'firstValueFrom' ditambahkan
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http'; // <-- 1. IMPORT PENTING

// Pastikan interface-nya lengkap
export interface UserProfile {
  uid: string;
  email: string;
  namaLengkap?: string;
  sekolah?: string;
  photoURL?: string; // <-- 2. Pastikan properti ini ada
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$ = authState(this.auth);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private http: HttpClient // <-- 3. Ganti 'Storage' dengan 'HttpClient'
  ) {}

  // Fungsi uploadAvatar dengan logika Cloudinary
  async uploadAvatar(userId: string, cameraPhoto: Photo) {
    const CLOUD_NAME = "ds9q96pu8";
    const UPLOAD_PRESET = "osuuj6cl"; // Nama preset "Unsigned" Anda

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const base64Response = await fetch(`data:image/${cameraPhoto.format};base64,${cameraPhoto.base64String}`);
    const photoBlob = await base64Response.blob();

    const formData = new FormData();
    formData.append('file', photoBlob);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response: any = await firstValueFrom(this.http.post(url, formData));
      const photoURL = response.secure_url;
      return this.updateUserProfile(userId, { photoURL });
    } catch (e) {
      console.error("Gagal meng-upload ke Cloudinary via API", e);
      throw e;
    }
  }

  getUserProfile(userId: string): Observable<UserProfile | null> {
    const ref = doc(this.firestore, `users/${userId}`);
    return docData(ref, { idField: 'id' }) as Observable<UserProfile | null>;
  }

  async updateUserProfile(userId: string, data: any) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return await updateDoc(userDocRef, data);
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