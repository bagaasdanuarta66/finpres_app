import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
// 1. Impor ContentService
import { ContentService } from '../services/content.service';
import { GeminiService } from '../services/gemini.service'; // Pastikan ini di-import

interface AiFeature {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-aibantuan',
  templateUrl: 'aibantuan.page.html',
  standalone: false,
})
export class AIBantuanPage {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  features: AiFeature[] = [
    { id: 'ppt', icon: '📊', title: 'Buat PPT', desc: 'Otomatis buat presentasi dari topik Anda.' },
    { id: 'solve', icon: '📷', title: 'Jawab Soal', desc: 'Upload foto soal dan dapatkan penjelasan.' },
    { id: 'image', icon: '🎨', title: 'Generate Gambar', desc: 'Buat ilustrasi dan diagram untuk tugas.' },
    { id: 'document', icon: '📝', title: 'Tulis Dokumen', desc: 'Proposal, laporan, dan karya ilmiah.' }
  ];

  messages: ChatMessage[] = [
    { sender: 'ai', text: 'Halo! Saya siap membantu Anda dengan tugas-tugas akademik. Apa yang bisa saya bantu hari ini?' }
  ];
  chatHistory: any[] = []; // Variabel untuk menyimpan riwayat chat untuk Gemini
  currentMessage: string = '';
  // 2. Tambahkan variabel untuk status loading
  isReplying: boolean = false;

  constructor(
    private alertController: AlertController,
    // 3. Suntikkan (inject) ContentService agar bisa kita gunakan
    private geminiService: GeminiService // <-- Cukup ini saja
  ) {}

  async openAIFeature(feature: AiFeature) {
    const alert = await this.alertController.create({
      header: `🚀 Fitur: ${feature.title}`,
      message: 'Fitur ini akan segera hadir untuk membantu Anda!',
      buttons: ['OK']
    });
    await alert.present();
  }

  // 4. GANTI FUNGSI INI DENGAN VERSI BARU YANG TERHUBUNG KE GEMINI
  async sendMessage() {
    const messageText = this.currentMessage.trim();
    // Jangan kirim pesan jika kosong atau jika AI sedang membalas
    if (messageText === '' || this.isReplying) return;

    // Tambahkan pesan pengguna ke tampilan
    this.messages.push({ sender: 'user', text: messageText });
    this.currentMessage = '';
    this.scrollToBottom();

    // Tampilkan indikator "mengetik..." dari AI
    this.isReplying = true;
    this.messages.push({ sender: 'ai', text: '...' });
    this.scrollToBottom();

    try {
      // Panggil service untuk bertanya ke Gemini melalui Firebase Function
const aiResponse = await this.geminiService.getChatResponse(messageText, this.chatHistory);      
      // Ganti pesan "..." dengan jawaban asli dari AI
      const lastMessageIndex = this.messages.length - 1;
      this.messages[lastMessageIndex].text = aiResponse;

    } catch (error) {
      console.error('Error memanggil Gemini:', error);
      const lastMessageIndex = this.messages.length - 1;
      this.messages[lastMessageIndex].text = 'Maaf, terjadi kesalahan. Coba lagi nanti.';
    } finally {
      // Selesai loading
      this.isReplying = false;
      this.scrollToBottom();
    }
  }
  
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBody && this.chatBody.nativeElement) {
        const chatContainer = this.chatBody.nativeElement;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}
