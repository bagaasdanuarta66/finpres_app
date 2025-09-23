import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs'; // <-- Impor firstValueFrom
import { ContentService, Program } from '../services/content.service';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.page.html',
  styleUrls: ['./program-detail.page.scss'],
  standalone : false,
})
export class ProgramDetailPage implements OnInit {

  program$: Observable<Program>;
  programId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.programId = this.route.snapshot.paramMap.get('id')!;
    this.program$ = this.contentService.getProgramById(this.programId);
  }

  ngOnInit() {}

  // Di dalam file program-detail.page.ts

async register() {
  const user = await firstValueFrom(this.authService.currentUser$);
  
  if (!user) {
    this.presentToast('Anda harus login untuk mendaftar.');
    return;
  }

  const loading = await this.loadingCtrl.create({ message: 'Memeriksa pendaftaran...' });
  await loading.present();

  try {
    // --- LANGKAH PENGECEKAN BARU ---
    const alreadyRegistered = await this.contentService.isUserRegistered(this.programId, user.uid);
    if (alreadyRegistered) {
      await loading.dismiss();
      this.presentToast('Anda sudah terdaftar di program ini.');
      return; // Hentikan proses jika sudah terdaftar
    }
    // ---------------------------------

    // Jika belum terdaftar, lanjutkan proses pendaftaran
    loading.message = 'Mendaftarkan...'; // Update pesan loading
    
    await this.contentService.registerForProgram(this.programId, user.uid);
    
    await loading.dismiss();
    this.presentToast('🎉 Selamat! Anda berhasil terdaftar.');
    this.router.navigateByUrl('/tabs/tab4');

  } catch (error: any) {
    await loading.dismiss();
    console.error('Gagal mendaftar:', error);
    this.presentToast(error.message || 'Gagal mendaftar. Coba lagi.');
  }
}
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}

