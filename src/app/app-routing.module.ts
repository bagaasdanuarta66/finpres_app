import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // --- UBAH BAGIAN INI ---
  {
    path: '', // Path kosong sekarang diarahkan ke halaman login
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs', // Kita buat path khusus untuk semua halaman yang memiliki tab bar
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
   {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'aibantuan',
    loadChildren: () => import('./aibantuan/aibantuan.module').then( m => m.AIBantuanPageModule)
  },
  {
    path: 'berita',
    loadChildren: () => import('./berita/berita.module').then( m => m.BeritaPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
