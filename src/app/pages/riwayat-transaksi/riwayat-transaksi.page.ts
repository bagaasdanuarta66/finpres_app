import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-riwayat-transaksi',
  templateUrl: './riwayat-transaksi.page.html',
  styleUrls: ['./riwayat-transaksi.page.scss'],
  standalone: false,
})
export class RiwayatTransaksiPage implements OnInit {

  transactions$!: Observable<any[]>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.transactions$ = this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          // Panggil fungsi yang baru kita buat untuk mengambil riwayat
          return this.authService.getTransactionsForUser(user.uid);
        } else {
          // Jika tidak ada user, kembalikan array kosong
          return of([]);
        }
      })
    );
  }
}