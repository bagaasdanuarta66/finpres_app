import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ContentService } from '../../services/content.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.page.html',
  styleUrls: ['./create-article.page.scss'],
  standalone: false,
})
export class CreateArticlePage implements OnInit {

  articleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private contentService: ContentService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    // Membangun form dengan semua field yang dibutuhkan untuk sebuah berita
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      excerpt: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      badge: ['', [Validators.required]],
      icon: ['📰', [Validators.required]], // Default icon
    });
  }

  ngOnInit() {
  }

  async submitArticle() {
    if (!this.articleForm.valid) {
      this.presentToast('Harap isi semua field yang wajib diisi.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Mempublikasikan berita...' });
    await loading.present();

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      loading.dismiss();
      this.presentToast('Sesi tidak valid, silakan login ulang.');
      return;
    }

    try {
      const userProfileSnap = await this.contentService.getUserProfile(currentUser.uid);
      const authorName = userProfileSnap.exists() ? userProfileSnap.data()['namaLengkap'] : 'Admin';

      const dataToSave = {
        ...this.articleForm.value,
        authorName: authorName,
        createdAt: serverTimestamp(),
      };

      await this.contentService.createArticle(dataToSave);
      
      await loading.dismiss();
      this.presentToast('Berita berhasil dipublikasikan!');
      this.router.navigateByUrl('/tabs/tab1/berita');

    } catch (error) {
      await loading.dismiss();
      console.error(error);
      this.presentToast('Gagal mempublikasikan berita.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
