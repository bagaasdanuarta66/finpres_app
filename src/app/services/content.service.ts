import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, orderBy, query, addDoc, serverTimestamp, getDoc, deleteDoc, runTransaction, arrayUnion, arrayRemove, increment, updateDoc, where, limit,  getCountFromServer } from '@angular/fire/firestore';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, map, tap, catchError, take } from 'rxjs/operators'; // <-- Tambahkan map


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
  kategori?: string;
  target: number;
  isExpired?: boolean; // <-- TAMBAHKAN BARIS INI
}
export interface Campaign {
  id: string; 
  userId: string;
   creatorName: string; 
   title: string;
    description: string;
     targetDana: number;
      danaTerkumpul: number; 
      imageUrl: string; 
      createdAt: any;
       trending?: boolean;
        status?: string; // <-- TAMBAHKAN INI
}
// Tambahkan ini di dekat interface Anda yang lain
export interface UserProgram {
  id: string;
  userId: string;
  programId: string;
  status: string;
  kemajuan: number;
  registeredAt: any;
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
  // Di dalam content.service.ts

// Di dalam content.service.ts

getRegisteredProgramsForUser(uid: string): Observable<any[]> {
  const userProgramsRef = collection(this.firestore, 'userPrograms');
  const q = query(userProgramsRef, where('userId', '==', uid));
  
  return (collectionData(q, { idField: 'id' }) as Observable<UserProgram[]>).pipe(
    take(1), // <-- TAMBAHKAN take(1) di sini
    switchMap(userPrograms => {
      if (userPrograms.length === 0) {
        return of([]);
      }
      
      const programObservables = userPrograms.map(up => { 
        const progRef = doc(this.firestore, `programs/${up.programId}`);
        return docData(progRef, { idField: 'id' }).pipe(
          take(1), // <-- DAN TAMBAHKAN take(1) di sini
          map(programDetails => ({ ...up, programDetails })),
          catchError(error => {
            console.warn(`Peringatan: Gagal mengambil detail untuk program ID ${up.programId}.`, error);
            return of({ ...up, programDetails: null });
          })
        );
      });
      
      return forkJoin(programObservables);
    })
  );
}

getCampaignsForUser(uid: string): Observable<any[]> {
    const campaignsRef = collection(this.firestore, 'campaigns');
    const q = query(campaignsRef, where('userId', '==', uid));
    return collectionData(q, { idField: 'id' });
  }
  getPopularPrograms(count: number): Observable<Program[]> {
    const programsRef = collection(this.firestore, 'programs');
    // Query untuk mengurutkan berdasarkan 'participants' (terbanyak ke sedikit)
    // dan mengambil hanya sejumlah 'count' (misalnya, 3 program teratas)
    const q = query(
      programsRef, 
      orderBy('participants', 'desc'), 
      limit(count)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Program[]>;
  }
  // Salin dan tempel SELURUH fungsi ini
getCompletedProgramsCount(uid: string): Observable<number> {
  // Menentukan koleksi mana yang mau dihitung
  const userProgramsRef = collection(this.firestore, 'userPrograms');
  
  // Membuat query untuk mencari dokumen dengan 2 syarat:
  // 1. userId harus cocok dengan pengguna yang login
  // 2. status harus 'selesai'
  const q = query(
    userProgramsRef,
    where('userId', '==', uid),
    where('status', '==', 'selesai')
  );

  // Menjalankan query hitung ke server dan mengubah hasilnya (Promise) menjadi Observable
  const countPromise = getCountFromServer(q).then(snapshot => snapshot.data().count);
  return from(countPromise);
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
  // Di dalam class ContentService

getCampaigns(): Observable<any[]> {
  const campaignsRef = collection(this.firestore, 'campaigns');
  const q = query(campaignsRef, orderBy('createdAt', 'desc'));
  return collectionData(q, { idField: 'id' });
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
// Di dalam content.service.ts

// Di dalam file content.service.ts

// Perhatikan perubahan return type di sini menjadi: Promise<boolean>
async simulateDonation(campaign: Campaign): Promise<boolean> {
  // Jika campaign sudah selesai, batalkan donasi dan kembalikan 'false'
  if (campaign.danaTerkumpul >= campaign.targetDana) {
    console.log('Target sudah tercapai, donasi dibatalkan.');
    return false; // <-- PENTING: Lapor bahwa donasi tidak terjadi
  }

  const campaignRef = doc(this.firestore, `campaigns/${campaign.id}`);
  const donationAmount = campaign.targetDana * 0.05;
  const danaSetelahDonasi = campaign.danaTerkumpul + donationAmount;
  let finalDana = danaSetelahDonasi >= campaign.targetDana ? campaign.targetDana : danaSetelahDonasi;

  try {
    if (finalDana >= campaign.targetDana) {
      // Jika donasi membuat target tercapai
      await updateDoc(campaignRef, { 
        danaTerkumpul: finalDana,
        status: 'selesai'
      });
    } else {
      // Jika donasi berhasil tapi belum mencapai target
      await updateDoc(campaignRef, { danaTerkumpul: increment(donationAmount) });
    }
    return true; // <-- PENTING: Lapor bahwa donasi BERHASIL
  } catch (error) {
    console.error("Gagal mengupdate donasi di Firestore:", error);
    return false; // <-- PENTING: Lapor bahwa donasi GAGAL
  }
  
}
// Fungsi baru untuk menambah progres dan mengecek status
// GANTI SELURUH FUNGSI ANDA DENGAN INI
async addProgramProgress(userProgramId: string, newProgressAmount: number) {
  const userProgramRef = doc(this.firestore, `userPrograms/${userProgramId}`);

  return runTransaction(this.firestore, async (transaction) => {
    // 1. Ambil data program yang diikuti user
    const userProgramDoc = await transaction.get(userProgramRef);
    if (!userProgramDoc.exists()) {
      throw "Dokumen program pengguna tidak ditemukan!";
    }
    // LAKUKAN TYPE CASTING DI SINI
    const userData = userProgramDoc.data() as UserProgram;

    // 2. Ambil data program utama untuk mendapatkan TARGET
    const programId = userData.programId; // -- Gunakan variabel baru
    const programRef = doc(this.firestore, `programs/${programId}`);
    const programDoc = await transaction.get(programRef);
    if (!programDoc.exists()) {
      throw "Dokumen program utama tidak ditemukan!";
    }
    // LAKUKAN TYPE CASTING DI SINI
    const programData = programDoc.data() as Program;
    
    const programTarget = programData.target || 0; // <-- Gunakan variabel baru
    const currentProgress = userData.kemajuan || 0; // <-- Gunakan variabel baru
    const newTotalProgress = currentProgress + newProgressAmount;

    // 3. Cek apakah target sudah tercapai
    if (newTotalProgress >= programTarget) {
      // JIKA SELESAI: Update kemajuan dan ubah status
      transaction.update(userProgramRef, { 
        kemajuan: newTotalProgress,
        status: 'selesai' 
      });
      console.log(`Program ${programId} selesai!`);
    } else {
      // JIKA BELUM SELESAI: Update kemajuannya saja
      transaction.update(userProgramRef, { kemajuan: newTotalProgress });
    }
  });
}
}
