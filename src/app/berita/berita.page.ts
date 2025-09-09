import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentService, NewsArticle, ForumPost  } from '../services/content.service';


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

  constructor(
    private alertController: AlertController,
    private router: Router,
    private contentService: ContentService 
  ) {}

  // Hanya ada SATU ngOnInit, ini adalah tempat yang benar
  ngOnInit() {
    // Memanggil service untuk mengambil data Berita dan Forum
    this.newsArticles$ = this.contentService.getNewsArticles();
    this.forumPosts$ = this.contentService.getForumPosts();
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
}