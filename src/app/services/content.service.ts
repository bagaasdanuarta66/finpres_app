import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, orderBy, query, addDoc, serverTimestamp, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Ini adalah "cetak biru" atau blueprint untuk data berita kita
// Memastikan kode kita tahu persis struktur data yang akan diterima
export interface NewsArticle {
  id: string;
  icon: string;
  badge: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  createdAt: any;
}

// ---- TAMBAHKAN INI ----
// Interface "cetak biru" untuk data Forum
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorSchool: string;
  likes: number;
  comments: number;
  createdAt: any;
}
// ---------------------

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private firestore: Firestore) { }

  // Fungsi untuk Berita (sudah ada)
  getNewsArticles(): Observable<NewsArticle[]> {
    const articlesRef = collection(this.firestore, 'articles');
    const q = query(articlesRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<NewsArticle[]>;
  }

  // ---- TAMBAHKAN INI ----
  // Fungsi baru untuk mengambil semua post forum
  getForumPosts(): Observable<ForumPost[]> {
    const postsRef = collection(this.firestore, 'forumPosts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<ForumPost[]>;
  }
  // ----------------------
  getPostById(id: string): Observable<ForumPost> {
  // 1. Menunjuk ke dokumen spesifik dengan ID yang diberikan
  const postRef = doc(this.firestore, `forumPosts/${id}`);

  // 2. Mengambil data dari dokumen tersebut
  return docData(postRef, { idField: 'id' }) as Observable<ForumPost>;
}
createForumPost(dataToSave: any) {
  const postsRef = collection(this.firestore, 'forumPosts');
  // addDoc adalah fungsi untuk menambahkan dokumen baru
  return addDoc(postsRef, dataToSave);
}
getUserProfile(uid: string) {
  const userRef = doc(this.firestore, `users/${uid}`);
  return getDoc(userRef);
}
}