// src/app/services/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Cek status login dari Firebase secara real-time
    return this.afAuth.authState.pipe(
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