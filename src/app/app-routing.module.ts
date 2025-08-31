import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard'; // <-- 1. IMPORT GUARD DI SINI

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard] // <-- 2. TERAPKAN "SATPAM" DI SINI
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
    path: 'admin/send-notification',
    loadChildren: () => import('./admin/notification-sender/notification-sender.module').then( m => m.NotificationSenderPageModule)
  },
  {
    path: 'notification-sender',
    loadChildren: () => import('./admin/notification-sender/notification-sender.module').then( m => m.NotificationSenderPageModule)
  },
  // Rute untuk aibantuan dan berita TIDAK PERLU di sini, 
  // karena mereka sudah menjadi "anak" dari 'tab1' di dalam tabs.router.module.ts
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}