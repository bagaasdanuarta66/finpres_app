import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, orderBy, query, addDoc, serverTimestamp, getDoc, deleteDoc, runTransaction, arrayUnion, arrayRemove, increment, updateDoc, where } from '@angular/fire/firestore';
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
  authorId: string;
   likedBy: string[]; 
  title: string;
  content: string;
  authorName: string;
  authorSchool: string;
  likes: number;
  comments: number;
  createdAt: any;
}
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}
export interface Program {
  id: string;
  icon: string;
  title: string;
  organizer: string;
  desc: string;
  points: number;
  deadline: string;
  participants: number;
  badge?: string;
}


// ---------------------

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  // CONSTRUCTOR SEHARUSNYA DI ATAS SEBELUM FUNGSI-FUNGSI LAIN
  constructor(private firestore: Firestore) { }
   getPrograms(): Observable<Program[]> {
    const programsRef = collection(this.firestore, 'programs');
    const q = query(programsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Program[]>;
  }

  getProgramById(programId: string): Observable<Program> {
    const programRef = doc(this.firestore, `programs/${programId}`);
    return docData(programRef, { idField: 'id' }) as Observable<Program>;
  }
  
  async registerForProgram(programId: string, userId: string): Promise<void> {
    const programRef = doc(this.firestore, `programs/${programId}`);
    const userProgramRef = doc(this.firestore, `userPrograms/${userId}_${programId}`);

    return runTransaction(this.firestore, async (transaction) => {
      const userProgramDoc = await transaction.get(userProgramRef);
      if (userProgramDoc.exists()) {
        throw new Error("Anda sudah terdaftar di program ini.");
      }
      transaction.set(userProgramRef, {
        userId: userId,
        programId: programId,
        status: 'berjalan',
        kemajuan: 0,
        registeredAt: serverTimestamp()
      });
      transaction.update(programRef, {
        participants: increment(1)
      });
    });
  }
  // --- SEMUA FUNGSI LAIN ADA DI BAWAH CONSTRUCTOR ---

  getNewsArticles(): Observable<NewsArticle[]> {
    const articlesRef = collection(this.firestore, 'articles');
    const q = query(articlesRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<NewsArticle[]>;
  }
  //INI FUNGSI BARU YANG KITA BUTUHKAN
  createArticle(dataToSave: any) {
    const articlesRef = collection(this.firestore, 'articles');
    return addDoc(articlesRef, dataToSave);
  }

  getForumPosts(): Observable<ForumPost[]> {
    const postsRef = collection(this.firestore, 'forumPosts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<ForumPost[]>;
  }

  getPostById(id: string): Observable<ForumPost> {
    const postRef = doc(this.firestore, `forumPosts/${id}`);
    return docData(postRef, { idField: 'id' }) as Observable<ForumPost>;
  }

  createForumPost(dataToSave: any) {
    const postsRef = collection(this.firestore, 'forumPosts');
    return addDoc(postsRef, dataToSave);
  }

  getUserProfile(uid: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef);
  }

  deleteForumPost(postId: string) {
    const postRef = doc(this.firestore, `forumPosts/${postId}`);
    return deleteDoc(postRef);
  }
  
  // FUNGSI 'toggleLike' KITA PINDAHKAN KE SINI
  async toggleLike(postId: string, userId: string) {
    const postRef = doc(this.firestore, `forumPosts/${postId}`);
  
    return runTransaction(this.firestore, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) {
        throw "Dokumen tidak ditemukan!";
      }
  
       // Kita beri tahu TypeScript bahwa data di dalam postDoc adalah tipe ForumPost
    const postData = postDoc.data() as ForumPost; 
    const likedBy = postData.likedBy || []; 
    
      let newLikesCount;
      let newLikedByArray;
  
      if (likedBy.includes(userId)) {
        // Jika user sudah pernah like -> batalkan like
        newLikedByArray = arrayRemove(userId);
        newLikesCount = increment(-1);
      } else {
        // Jika user belum pernah like -> tambahkan like
        newLikedByArray = arrayUnion(userId);
        newLikesCount = increment(1);
      }
  
      transaction.update(postRef, { 
        likedBy: newLikedByArray,
        likes: newLikesCount
      });
    });
  }
   getCommentsForPost(postId: string): Observable<Comment[]> {
    const commentsRef = collection(this.firestore, `forumPosts/${postId}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Comment[]>;
  }

  async addCommentToPost(postId: string, commentData: any) {
    const commentsRef = collection(this.firestore, `forumPosts/${postId}/comments`);
    await addDoc(commentsRef, commentData);

    const postRef = doc(this.firestore, `forumPosts/${postId}`);
    return updateDoc(postRef, { 
      comments: increment(1)
    });
  }
  async checkIfAdmin(uid: string): Promise<boolean> {
  // --- TAMBAHKAN LOG #1: UID APA YANG DICEK? ---
  console.log('Mengecek status admin untuk UID:', uid);
  // ---------------------------------------------

  const adminRef = doc(this.firestore, `admins/${uid}`);
  const adminSnap = await getDoc(adminRef);

  // --- TAMBAHKAN LOG #2: APA HASILNYA? ---
  console.log('Apakah dokumen admin ditemukan?', adminSnap.exists());
  // ------------------------------------------

  return adminSnap.exists();
}
}