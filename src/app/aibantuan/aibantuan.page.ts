import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GeminiService } from '../services/gemini.service';

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
  standalone : false,
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
  
  // Variabel untuk menyimpan riwayat chat untuk Gemini
  chatHistory: any[] = [];
  
  currentMessage: string = '';
  isReplying: boolean = false;

  constructor(
    private alertController: AlertController,
    private geminiService: GeminiService
  ) {}

  async openAIFeature(feature: AiFeature) {
    const alert = await this.alertController.create({
      header: `🚀 Fitur: ${feature.title}`,
      message: 'Fitur ini akan segera hadir untuk membantu Anda!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async sendMessage() {
    const messageText = this.currentMessage.trim();
    if (messageText === '' || this.isReplying) return;

    // Tambahkan pesan ke tampilan layar
    this.messages.push({ sender: 'user', text: messageText });
    // TAMBAHKAN PESAN PENGGUNA KE RIWAYAT UNTUK DIKIRIM KE GEMINI
    this.chatHistory.push({ role: "user", parts: [{ text: messageText }] });

    this.currentMessage = '';
    this.scrollToBottom();

    this.isReplying = true;
    this.messages.push({ sender: 'ai', text: '...' });
    this.scrollToBottom();

    try {
      // Panggil service Gemini dan kirimkan riwayatnya
      const aiResponse = await this.geminiService.getChatResponse(messageText, this.chatHistory);
      
      const lastMessageIndex = this.messages.length - 1;
      this.messages[lastMessageIndex].text = aiResponse;

      // TAMBAHKAN JAWABAN AI KE RIWAYAT UNTUK PERCAKAPAN SELANJUTNYA
      this.chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });

    } catch (error) {
      console.error('Error:', error);
      const lastMessageIndex = this.messages.length - 1;
      this.messages[lastMessageIndex].text = 'Maaf, terjadi kesalahan.';
    } finally {
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