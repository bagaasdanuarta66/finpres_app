import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Category {
  id: string;
  icon: string;
  title: string;
  count: number;
  badge: string;
  delay: string;
}

interface Program {
  id: string;
  icon: string;
  title: string;
  organizer: string;
  desc: string;
  points: number;
  deadline: string;
  participants: string;
  badge: string;
  delay: string;
  badgeClass: string;
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit, AfterViewInit {

  // DIPERBAIKI: Menambahkan '!' untuk memberitahu TypeScript bahwa properti ini akan diinisialisasi oleh @ViewChild.
  @ViewChild('totalPrograms', { static: false }) totalProgramsEl!: ElementRef<HTMLElement>;
  @ViewChild('activeParticipants', { static: false }) activeParticipantsEl!: ElementRef<HTMLElement>;
  @ViewChild('successRate', { static: false }) successRateEl!: ElementRef<HTMLElement>;

  categories: Category[] = [
    { id: 'kompetisi', icon: '🏆', title: 'Kompetisi', count: 25, badge: 'POPULER', delay: '0.1s' },
    { id: 'sosial', icon: '🤝', title: 'Project Sosial', count: 18, badge: 'TRENDING', delay: '0.2s' },
    { id: 'seni', icon: '🎨', title: 'Seni & Pentas', count: 22, badge: 'KREATIF', delay: '0.3s' },
    { id: 'sains', icon: '🔬', title: 'Project Sains', count: 15, badge: 'INOVATIF', delay: '0.4s' },
    { id: 'keagamaan', icon: '🕌', title: 'Keagamaan', count: 12, badge: 'SPIRITUAL', delay: '0.5s' },
    { id: 'lainnya', icon: '🌟', title: 'Lain-lainnya', count: 20, badge: 'BERAGAM', delay: '0.6s' }
  ];

  allPrograms: Program[] = [
    { id: 'osn', icon: '🏆', title: 'Olimpiade Sains Nasional 2025', organizer: 'Kementerian Pendidikan RI', desc: 'Kompetisi sains tingkat nasional untuk siswa SMA dengan hadiah beasiswa dan pembinaan khusus dari mentor terbaik', points: 500, deadline: '15 Juli 2025', participants: '1,234', badge: 'BARU', delay: '0.7s', badgeClass: '' },
    { id: 'film', icon: '🎨', title: 'Festival Film Pendek Siswa', organizer: 'Komunitas Filmmaker Indonesia', desc: 'Kompetisi pembuatan film pendek dengan tema "Indonesia Masa Depan" untuk siswa SMA se-Indonesia', points: 300, deadline: '20 Juli 2025', participants: '567', badge: '', delay: '0.8s', badgeClass: '' },
    { id: 'science', icon: '🔬', title: 'Indonesia Science Project Fair', organizer: 'LIPI & Universitas Indonesia', desc: 'Pameran dan kompetisi proyek sains inovatif tingkat nasional untuk siswa SMA dengan mentor profesional', points: 450, deadline: '10 Agustus 2025', participants: '892', badge: 'HOT', delay: '0.9s', badgeClass: 'hot' },
    { id: 'sosial', icon: '🤝', title: 'Bakti Sosial Nusantara', organizer: 'PMI & Karang Taruna Indonesia', desc: 'Program pengabdian masyarakat untuk membantu daerah terpencil dengan pendekatan teknologi modern', points: 200, deadline: '25 Juli 2025', participants: '345', badge: '', delay: '1.0s', badgeClass: '' },
    { id: 'tahfidz', icon: '🕌', title: 'Lomba Tahfidz Al-Quran Nasional', organizer: 'Lembaga Tahfidz Indonesia', desc: 'Kompetisi menghafal Al-Quran tingkat nasional untuk siswa dengan pembinaan dari ulama terbaik Indonesia', points: 350, deadline: '30 Juli 2025', participants: '678', badge: '', delay: '1.1s', badgeClass: '' },
    { id: 'leadership', icon: '🌟', title: 'Leadership Camp Nasional', organizer: 'Indonesia Future Leaders', desc: 'Program pelatihan kepemimpinan intensif untuk membentuk pemimpin muda Indonesia masa depan', points: 600, deadline: '5 Agustus 2025', participants: '423', badge: '', delay: '1.2s', badgeClass: '' }
  ];
  
  filteredPrograms: Program[] = [...this.allPrograms];

  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.totalProgramsEl?.nativeElement) {
        this.animateCounter(this.totalProgramsEl.nativeElement, 112);
      }
      if (this.activeParticipantsEl?.nativeElement) {
        this.animateCounter(this.activeParticipantsEl.nativeElement, 5200, 'K');
      }
      if (this.successRateEl?.nativeElement) {
        this.animateCounter(this.successRateEl.nativeElement, 89, '%');
      }
    }, 1000);
  }

  async openCategory(category: Category) {
    const alert = await this.alertController.create({
      header: `🏆 Kategori ${category.title}`,
      message: `Anda akan melihat semua program dalam kategori ini dengan filter dan sorting yang tersedia.`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async viewProgram(program: Program) {
    const alert = await this.alertController.create({
      header: `📋 Detail Program`,
      subHeader: program.title,
      message: `✨ Fitur yang tersedia:<br>• Informasi lengkap program<br>• Cara mendaftar<br>• Timeline kegiatan<br>• Mentor dan fasilitas<br>• Sertifikat dan rewards`,
      buttons: ['Tutup'],
    });
    await alert.present();
  }

  filterPrograms(event: Event) {
    const customEvent = event as CustomEvent;
    const searchTerm = (customEvent.detail.value || '').toLowerCase();

    if (!searchTerm) {
      this.filteredPrograms = [...this.allPrograms];
      return;
    }
    
    this.filteredPrograms = this.allPrograms.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.organizer.toLowerCase().includes(searchTerm) ||
      p.desc.toLowerCase().includes(searchTerm)
    );
  }
  
  animateCounter(element: HTMLElement, target: number, suffix: string = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (suffix === 'K') {
        element.textContent = (current / 1000).toFixed(1) + 'K';
      } else if (suffix === '%') {
        element.textContent = Math.floor(current) + '%';
      } else {
        element.textContent = Math.floor(current).toString();
      }
    }, 20);
  }
}
