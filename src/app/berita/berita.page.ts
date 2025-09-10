import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentService, NewsArticle, ForumPost  } from '../services/content.service';
import { Auth, User } from '@angular/fire/auth'; 


@Component({
  selector: 'app-berita',
  templateUrl: 'berita.page.html',
  standalone: false,
})
export class BeritaPage implements OnInit {
  
  activeTab: 'news' | 'forum' = 'news';

  // Menyiapkan wadah dinamis untuk Berita
  newsArticles$!: Observable<NewsArticle[]>;
  
  // Menyiapkan wadah dinamis untuk Forum
  forumPosts$!: Observable<ForumPost[]>;
  currentUser: User | null = null;


  constructor(
    private alertController: AlertController,
    private router: Router,
    private contentService: ContentService,
    private auth: Auth
  ) {
    // Kode untuk mendapatkan info user diletakkan DI DALAM constructor
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }

  // Hanya ada SATU ngOnInit, ini adalah tempat yang benar
  ngOnInit() {
    // Memanggil service untuk mengambil data Berita dan Forum
    this.newsArticles$ = this.contentService.getNewsArticles();
    this.forumPosts$ = this.contentService.getForumPosts();
  }
// --- FUNGSI BARU UNTUK MENANGANI LIKE ---
  onLike(post: ForumPost, event: Event) {
    // Baris ini sangat penting untuk mencegah klik tembus ke kartu
    event.stopPropagation();

    if (!this.currentUser) {
      this.showAlert('🔒', 'Anda harus login untuk menyukai postingan ini.');
      return;
    }

    // Panggil service untuk menambah/membatalkan like
    this.contentService.toggleLike(post.id, this.currentUser.uid)
      .catch(err => {
        console.error('Gagal melakukan like:', err);
        this.showAlert('❌', 'Terjadi kesalahan saat menyukai postingan.');
      });
  }
  // --- Fungsi-fungsi di bawah ini tidak berubah ---

  switchTab(tabName: 'news' | 'forum') {
    this.activeTab = tabName;
  }
  
  async createContent() {
    this.showAlert('✍️', 'Fitur "Buat Konten" akan segera tersedia!');
  }

  createPost() {
  // Menggunakan router untuk berpindah ke halaman formulir
  this.router.navigate(['/create-post']);
}
  
  async viewArticle(article: NewsArticle) {
    this.showAlert('📖', `Membaca artikel: ${article.title}`);
  }

  viewPost(post: ForumPost) {
  // Menggunakan router untuk navigasi ke halaman detail
  // sambil mengirimkan ID unik dari postingan tersebut
  this.router.navigate(['/post-detail', post.id]);
}
  
  private async showAlert(icon: string, message: string) {
    const alert = await this.alertController.create({
      header: icon, message: message, buttons: ['OK']
    });
    await alert.present();
  }
   async deletePost(postId: string) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak bisa dibatalkan.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          handler: () => {
             this.contentService.deleteForumPost(postId); 
            // Panggil service untuk menghapus.
            // Kita akan buat fungsi ini di langkah selanjutnya.
            // this.contentService.deleteForumPost(postId);
            console.log(`Perintah hapus untuk post ID: ${postId}`);
          },
        },
      ],
    });

    await alert.present();
    this.contentService.deleteForumPost(postId); 
  }
  
}