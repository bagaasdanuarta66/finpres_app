import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ContentService } from '../../services/content.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
  standalone: false,
})
export class CreatePostPage implements OnInit {

  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private contentService: ContentService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  async submitPost() {
    if (!this.postForm.valid) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Mengirim postingan...',
    });
    await loading.present();

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      loading.dismiss();
      this.presentToast('Anda harus login untuk membuat postingan.');
      return;
    }

    try {
      const userProfileSnap = await this.contentService.getUserProfile(currentUser.uid);

      if (userProfileSnap.exists()) {
        const userProfile = userProfileSnap.data();
        
        const dataToSave = {
          ...this.postForm.value,
          authorId: currentUser.uid,
          authorName: userProfile['namaLengkap'],
          authorSchool: userProfile['sekolah'],
          createdAt: serverTimestamp(),
          likes: 0,
          comments: 0
        };

        await this.contentService.createForumPost(dataToSave);
        
        await loading.dismiss();
        this.presentToast('Postingan berhasil dibuat!');
        this.router.navigateByUrl('/tabs/tab1/berita');

      } else {
        throw new Error('Profil pengguna tidak ditemukan.');
      }

    } catch (error) {
      await loading.dismiss();
      console.error(error);
      this.presentToast('Gagal membuat postingan. Silakan coba lagi.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}