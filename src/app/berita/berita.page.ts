import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentService, NewsArticle, ForumPost } from '../services/content.service';
import { Auth, User } from '@angular/fire/auth';
import { ArticleDetailComponent } from '../components/article-detail/article-detail.component';


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
isCurrentUserAdmin = false; // Awalnya kita anggap bukan admin

  constructor(
  private alertController: AlertController,
  private router: Router,
  private contentService: ContentService,
  private auth: Auth,
   private modalCtrl: ModalController
) {
  this.auth.onAuthStateChanged(async (user) => { // Tambahkan 'async' di sini
    this.currentUser = user;
    if (user) {
      // Setelah mendapatkan user, langsung cek status adminnya
      this.isCurrentUserAdmin = await this.contentService.checkIfAdmin(user.uid);
        // --- TAMBAHKAN BARIS INI UNTUK MENGINTIP ---
      console.log('STATUS ADMIN:', this.isCurrentUserAdmin);
      // -
    } else {
      // Jika tidak ada user, status admin pasti false
      this.isCurrentUserAdmin = false;
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
  
 createContent() {
  this.router.navigate(['/create-article']);
}
  createPost() {
  // Menggunakan router untuk berpindah ke halaman formulir
  this.router.navigate(['/create-post']);
}
  
async viewArticle(article: NewsArticle) {
  // Membuat modal/pop-up
  const modal = await this.modalCtrl.create({
    component: ArticleDetailComponent, // Komponen yang akan ditampilkan
    componentProps: {
      'article': article // Mengirim data artikel ke dalam modal
    }
  });
  // Menampilkan modal
  return await modal.present();
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