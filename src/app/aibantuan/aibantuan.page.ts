import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';

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
  standalone: false, // <-- INI KODE YANG ANDA MINTA
})
export class AIBantuanPage {
  // Menggunakan ViewChild untuk mengakses elemen chatBody
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
  
  // Variabel untuk menampung teks dari input field
  currentMessage: string = '';

  constructor(private alertController: AlertController) {}

  async openAIFeature(feature: AiFeature) {
    const alert = await this.alertController.create({
      header: `🚀 Fitur: ${feature.title}`,
      message: 'Fitur ini akan segera hadir untuk membantu Anda!',
      buttons: ['OK']
    });
    await alert.present();
  }

  sendMessage() {
    const messageText = this.currentMessage.trim();
    if (messageText === '') return;

    // 1. Tambahkan pesan pengguna ke array
    this.messages.push({ sender: 'user', text: messageText });
    this.currentMessage = ''; // Kosongkan input field
    this.scrollToBottom();

    // 2. Simulasikan jawaban dari AI
    setTimeout(() => {
      const responses = [
          "Pertanyaan yang menarik! Saya akan membantu Anda.",
          "Baik, saya akan memberikan jawaban lengkap.",
          "Topik yang bagus! Mari kita bahas ini secara detail.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      this.messages.push({ sender: 'ai', text: randomResponse });
      this.scrollToBottom();
    }, 1500);
  }
  
  // Fungsi untuk otomatis scroll ke pesan paling bawah
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBody && this.chatBody.nativeElement) {
        const chatContainer = this.chatBody.nativeElement;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}