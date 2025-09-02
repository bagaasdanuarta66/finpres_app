// src/app/services/auth-guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth'; // <-- 1. TAMBAHKAN 'User' DI SINI
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    console.log('[AuthGuard] Sedang berjalan... Mengecek status login...'); // <-- LOG #1

    // 2. PERBAIKI TIPE DATA DI SINI MENJADI <User | null>
    return new Observable<User | null>((subscriber) => {
      const unsub = onAuthStateChanged(this.auth, (user) => subscriber.next(user), (err) => subscriber.error(err));
      return () => unsub();
    }).pipe(
      take(1),
      map(user => { // Di sini, 'user' sudah dikenali sebagai object User atau null
        if (user) {
          console.log('[AuthGuard] DITEMUKAN PENGGUNA:', user.email, '. Akses DIIZINKAN.'); // <-- LOG #2
          return true;
        } else {
          console.error('[AuthGuard] TIDAK ADA PENGGUNA. Akses DITOLAK. Mengarahkan ke /login...'); // <-- LOG #3
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}