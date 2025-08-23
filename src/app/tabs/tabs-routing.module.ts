// src/app/tabs/tabs.router.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        // --- DI DALAM 'tab1' KITA BUAT 'children' LAGI ---
        children: [
          {
            path: '', // Ini adalah path untuk halaman Beranda itu sendiri (/tabs/tab1)
            loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          },
          {
            path: 'aibantuan', // Path ini akan menjadi /tabs/tab1/aibantuan
            loadChildren: () => import('../aibantuan/aibantuan.module').then(m => m.AIBantuanPageModule)
          },
          {
            path: 'berita', // Path ini akan menjadi /tabs/tab1/berita
            loadChildren: () => import('../berita/berita.module').then(m => m.BeritaPageModule)
          }
        ]
        // ------------------------------------------------
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule)
      },
      // Rute default tetap sama
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}