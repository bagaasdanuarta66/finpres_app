import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false, // <-- TAMBAHKAN INI UNTUK KONSISTENSI
})
export class AppComponent {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        // Jika ada pengguna yang login dari sesi sebelumnya,
        // langsung arahkan ke halaman utama.
        console.log('Sesi ditemukan, mengarahkan ke halaman utama.');
        this.router.navigate(['/tabs/tab1']);
      } else {
        // Jika tidak ada pengguna yang login,
        // arahkan ke halaman login.
        console.log('Tidak ada sesi, mengarahkan ke halaman login.');
        this.router.navigate(['/login']);
      }
    });
  }
}