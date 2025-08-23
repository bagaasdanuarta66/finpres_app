import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

// Definisikan tipe data agar kode lebih rapi
interface NewsArticle {
  id: string;
  icon: string;
  badge: string;
  title: string;
  excerpt: string;
  authorInitial: string;
  authorName: string;
  time: string;
}

interface ForumPost {
  id: string;
  authorInitial: string;
  authorName: string;
  authorSchool: string;
  time: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
}

@Component({
  selector: 'app-berita',
  templateUrl: 'berita.page.html',
  standalone: false,
})
export class BeritaPage {
  
  // Properti untuk mengontrol tab yang aktif di dalam halaman
  activeTab: 'news' | 'forum' = 'news';

  // Data untuk berita
  newsArticles: NewsArticle[] = [
    { id: 'fisika', icon: '🏆', badge: 'PRESTASI', title: 'Siswa SMA Jakarta Raih Medali Emas Olimpiade Fisika Internasional', excerpt: 'Ahmad Ridwan dari SMA Negeri 8 Jakarta berhasil meraih medali emas...', authorInitial: 'AR', authorName: 'Admin Sakuma', time: '2 jam lalu' },
    { id: 'air', icon: '🔬', badge: 'SAINS', title: 'Proyek Air Bersih Siswa SMA Bandung Jadi Solusi Desa', excerpt: 'Tim peneliti muda dari SMA Negeri 3 Bandung mengembangkan teknologi filter...', authorInitial: 'RP', authorName: 'Reporter', time: '4 jam lalu' },
    { id: 'teater', icon: '🎨', badge: 'SENI', title: 'Festival Teater Siswa Nasional Hadirkan 50 Karya Terbaik', excerpt: 'Festival Teater Siswa Nasional 2025 menghadirkan 50 karya terbaik...', authorInitial: 'ST', authorName: 'Tim Seni', time: '6 jam lalu' }
  ];

  // Data untuk forum
  forumPosts: ForumPost[] = [
    { id: 'osn', authorInitial: 'RA', authorName: 'Rika Aprilia', authorSchool: 'SMA Negeri 5 Jakarta', time: '5 menit lalu', title: 'Bagaimana cara efektif belajar matematika untuk OSN?', content: 'Halo teman-teman! Saya sedang persiapan untuk OSN Matematika tingkat provinsi...', likes: 12, comments: 8 },
    { id: 'coding', authorInitial: 'DF', authorName: 'Dani Firmansyah', authorSchool: 'SMA Plus Al-Azhar', time: '1 jam lalu', title: 'Review aplikasi belajar coding untuk pemula', content: 'Hai guys! Mau share pengalaman saya belajar coding selama 6 bulan terakhir...', likes: 23, comments: 15 }
  ];

  constructor(private alertController: AlertController) {}

  // Fungsi untuk mengganti tab antara Berita dan Forum
  switchTab(tabName: 'news' | 'forum') {
    this.activeTab = tabName;
  }

  async createContent() {
    this.showAlert('✍️', 'Fitur "Buat Konten" akan segera tersedia!');
  }

  async createPost() {
    this.showAlert('📝', 'Fitur "Buat Post Forum Baru" akan segera hadir!');
  }
  
  async viewArticle(article: NewsArticle) {
    this.showAlert('📖', `Membaca artikel: ${article.title}`);
  }

  async viewPost(post: ForumPost) {
    this.showAlert('💭', `Membuka diskusi: ${post.title}`);
  }

  // Helper function untuk menampilkan alert
  private async showAlert(icon: string, message: string) {
    const alert = await this.alertController.create({
      header: icon,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}