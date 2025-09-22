// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, firstValueFrom } from 'rxjs'; // 'firstValueFrom' ditambahkan
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData, updateDoc, collection, addDoc, deleteDoc } from '@angular/fire/firestore';
import { Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http'; 
import { map, switchMap } from 'rxjs/operators'; // <-- PASTIKAN INI DIIMP
// Pastikan interface-nya lengkap
export interface UserProfile {
  uid: string;
  email: string;
  namaLengkap?: string;
  sekolah?: string;
  photoURL?: string; // <-- 2. Pastikan properti ini ada
  saldo?: number; // <-- Tambahan
  poin?: number;  // <-- Tambahan
  role?: 'admin' | 'user';
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$ = authState(this.auth);
  isAdmin$: Observable<boolean>; // <-- PASTIKAN PROPERTI INI ADA

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private http: HttpClient // <-- 3. Ganti 'Storage' dengan 'HttpClient'
  ) { this.isAdmin$ = this.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          // Jika user login, cek ke koleksi 'admins'
          const adminDocRef = doc(this.firestore, `admins/${user.uid}`);
          // Menggunakan docData untuk mendapatkan stream, lalu map hasilnya ke boolean
          return docData(adminDocRef).pipe(
            map(adminDoc => !!adminDoc) // Jika dokumen ada, hasilnya true, jika tidak, false
          );
        } else {
          // Jika tidak ada user yang login, hasilnya false
          return of(false);
        }
      })
    );
  }

  // Fungsi uploadAvatar dengan logika Cloudinary
   async uploadImage(photo: Photo, folder: string) {
    const CLOUD_NAME = "ds9q96pu8";
    const UPLOAD_PRESET = "osuuj6cl"; // Nama preset "Unsigned" Anda

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const base64Response = await fetch(`data:image/${photo.format};base64,${photo.base64String}`);
    const photoBlob = await base64Response.blob();
   

    const formData = new FormData();
    formData.append('file', photoBlob);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder); 

  try {
      const response: any = await firstValueFrom(this.http.post(url, formData));
      // Perbaikan: Fungsi ini HANYA mengembalikan URL
      return response.secure_url;
    } catch (e) {
      console.error("Gagal meng-upload ke Cloudinary via API", e);
      throw e;
    }
  }
   async uploadAvatar(userId: string, cameraPhoto: Photo) {
    const photoURL = await this.uploadImage(cameraPhoto, 'avatars');
    return this.updateUserProfile(userId, { photoURL });
  }

  // FUNGSI BARU YANG REAL-TIME
getUserProfile(userId: string) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    // docData() akan terus 'mendengarkan' perubahan pada dokumen ini
    // dan otomatis mengirimkan data terbaru setiap kali ada update.
    return docData(userDocRef, { idField: 'id' });
}


  async updateUserProfile(userId: string, data: any) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return await updateDoc(userDocRef, data);
  }
   async addProgram(userId: string, programData: any) {
    const programsRef = collection(this.firestore, 'programs');
    // Simpan data dari form, lalu tambahkan info tambahan
    return await addDoc(programsRef, {
      ...programData, // Ini berisi namaProgram dan targetDana
      danaTerkumpul: 0, // Setiap program baru dimulai dengan dana 0
      userId: userId,
      createdAt: new Date(),
    });
  }

  // Fungsi addTransaction yang sudah kita buat sebelumnya


   async addTransaction(userId: string, transactionData: any) {
    // Tentukan referensi ke koleksi 'transactions'
    const transactionsRef = collection(this.firestore, 'transactions');
    
    // Simpan data baru, tambahkan userId dan tanggal pembuatan secara otomatis
    return await addDoc(transactionsRef, {
      ...transactionData, // <-- Ini adalah data dari form (misalnya: deskripsi, jumlah, tipe)
      userId: userId,
      createdAt: new Date(),
    });
  }

 async addCampaign(userId: string, campaignData: any) {
    const campaignsRef = collection(this.firestore, 'campaigns');
    // Simpan data dari form, lalu tambahkan info tambahan
    return await addDoc(campaignsRef, {
      ...campaignData, // Ini berisi title, description, targetDana, category, creatorName
      danaTerkumpul: 0, // Setiap campaign baru dimulai dengan dana 0
      userId: userId,
      createdAt: new Date(),
      trending: false, // Default tidak trending
    });
  }
    async deleteCampaign(campaignId: string) {
    const campaignDocRef = doc(this.firestore, `campaigns/${campaignId}`);
    return await deleteDoc(campaignDocRef);
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
          saldo: 0,
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