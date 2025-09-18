import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Kita gunakan BehaviorSubject agar komponen lain bisa "mendengarkan" perubahan tema
  public isDarkMode = new BehaviorSubject<boolean>(false);

  constructor() {
    // Cek preferensi mode gelap dari sistem operasi (HP/Laptop) saat aplikasi pertama kali dimuat
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode.next(prefersDark.matches);
    this.updateBodyClass(this.isDarkMode.value);

    // Terus dengarkan jika pengguna mengubah setelan di sistem operasinya
    prefersDark.addEventListener('change', (e) => {
      this.isDarkMode.next(e.matches);
      this.updateBodyClass(this.isDarkMode.value);
    });
  }

  // Fungsi ini akan dipanggil oleh tombol toggle kita nanti
  public toggleTheme() {
    const newMode = !this.isDarkMode.value;
    this.isDarkMode.next(newMode);
    this.updateBodyClass(newMode);
  }

  // Fungsi bantuan untuk menambah atau menghapus class 'dark' dari body HTML
  private updateBodyClass(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
  }
}