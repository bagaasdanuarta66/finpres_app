import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentService, ForumPost } from '../../services/content.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  standalone: false,
})
export class PostDetailPage implements OnInit {

  // Menyiapkan "wadah" untuk menampung data satu postingan
  post$!: Observable<ForumPost>;

  constructor(
    private route: ActivatedRoute, // Untuk membaca parameter dari URL
    private contentService: ContentService
  ) { }

  ngOnInit() {
    // 1. Ambil 'id' dari URL saat halaman dibuka
    const postId = this.route.snapshot.paramMap.get('id');

    // 2. Jika ada ID, panggil service untuk mengambil data
    if (postId) {
      this.post$ = this.contentService.getPostById(postId);
    }
  }

}