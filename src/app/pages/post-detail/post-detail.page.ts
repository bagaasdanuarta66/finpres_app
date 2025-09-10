import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentService, ForumPost, Comment } from '../../services/content.service';
import { Auth } from '@angular/fire/auth';
import { serverTimestamp } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  standalone: false,
})
export class PostDetailPage implements OnInit {

  post$!: Observable<ForumPost>;
  comments$!: Observable<Comment[]>; // Wadah untuk daftar komentar
  newComment = ''; // Wadah untuk teks di input komentar
  postId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService,
    private auth: Auth,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // Ambil 'id' dari URL saat halaman dibuka
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      // Ambil data postingan utama
      this.post$ = this.contentService.getPostById(this.postId);
      // Ambil daftar komentar untuk postingan ini
      this.comments$ = this.contentService.getCommentsForPost(this.postId);
    }
  }

  // Fungsi untuk mengirim komentar baru
  async addComment() {
    // Cek apakah input komentar kosong atau hanya spasi
    if (!this.newComment.trim()) return;

    const currentUser = this.auth.currentUser;
    if (!currentUser || !this.postId) {
      this.presentToast('Anda harus login untuk berkomentar.');
      return;
    }

    try {
      // Ambil nama pengguna dari profilnya
      const userProfileSnap = await this.contentService.getUserProfile(currentUser.uid);
      if (!userProfileSnap.exists()) {
        throw new Error('Profil pengguna tidak ditemukan.');
      }
      const authorName = userProfileSnap.data()['namaLengkap'];

      // Siapkan data komentar yang akan disimpan
      const commentData = {
        content: this.newComment,
        authorId: currentUser.uid,
        authorName: authorName,
        createdAt: serverTimestamp(),
      };

      // Panggil service untuk menyimpan komentar
      await this.contentService.addCommentToPost(this.postId, commentData);
      
      // Kosongkan kembali input setelah berhasil
      this.newComment = '';
    } catch (error) {
      console.error(error);
      this.presentToast('Gagal mengirim komentar.');
    }
  }

  // Fungsi helper untuk notifikasi
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}

