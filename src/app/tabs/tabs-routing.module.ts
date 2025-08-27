// src/app/tabs/tabs.router.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    // Path ini dikosongkan karena 'tabs' sudah diurus oleh app-routing.module.ts
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1', // Alamatnya akan otomatis menjadi /tabs/tab1
        // Di dalam 'tab1' kita buat 'children' lagi
        children: [
          {
            path: '', // Ini untuk /tabs/tab1
            loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          },
          {
            path: 'aibantuan', // Ini untuk /tabs/tab1/aibantuan
            loadChildren: () => import('../aibantuan/aibantuan.module').then(m => m.AIBantuanPageModule)
          },
          {
            path: 'berita', // Ini untuk /tabs/tab1/berita
            loadChildren: () => import('../berita/berita.module').then(m => m.BeritaPageModule)
          }
        ]
      },
      {
        path: 'tab2', // Alamatnya akan otomatis menjadi /tabs/tab2
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      { // <-- PASTIKAN BAGIAN INI ADA
    path: 'tab3', // Untuk Campaign
    loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
  },
      {
        path: 'tab4', // Alamatnya akan otomatis menjadi /tabs/tab4
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule)
      },
      // ... Rute tab lain jika ada
      {
        path: '', // Jika pengguna hanya mengakses /tabs, arahkan ke tab1
        redirectTo: 'tab1',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}