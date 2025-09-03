// src/main.ts

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// --- 1. TAMBAHKAN IMPORT INI ---
import { defineCustomElements } from '@ionic/pwa-elements/loader';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// --- 2. TAMBAHKAN PEMANGGILAN FUNGSI INI DI PALING BAWAH ---
defineCustomElements(window);