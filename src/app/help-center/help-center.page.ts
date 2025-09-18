import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.page.html',
  styleUrls: ['./help-center.page.scss'],
  standalone: false,
})
export class HelpCenterPage implements OnInit {
// Di dalam class HelpCenterPage

contactCS() {
  // Ganti 628123456789 dengan nomor WhatsApp CS Anda
  const waNumber = '628123456789';
  const message = 'Halo, saya butuh bantuan terkait aplikasi Finpress.';

  // Membuka link WhatsApp di tab baru
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
}
  constructor() { }

  ngOnInit() {
  }

}
