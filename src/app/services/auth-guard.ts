// src/app/services/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Cek status login dari Firebase secara real-time
    return new Observable((subscriber) => {
      const unsub = onAuthStateChanged(this.auth, (u) => subscriber.next(u), (e) => subscriber.error(e));
      return () => unsub();
    }).pipe(
      take(1), // Ambil status terkini sekali saja
      map(user => {
        if (user) {
          // Jika ada user (sudah login), izinkan masuk ke halaman.
          return true;
        } else {
          // Jika tidak ada user, "tendang" atau arahkan ke halaman login.
          console.log('Akses ditolak oleh Guard, pengguna belum login.');
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}