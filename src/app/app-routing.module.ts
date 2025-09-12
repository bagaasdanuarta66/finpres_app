// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
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
    path: 'pages/add-transaction',
    loadChildren: () => import('./pages/add-transaction/add-transaction.module').then( m => m.AddTransactionPageModule)
  },
   {
    path: 'pages/add-program',
    loadChildren: () => import('./pages/add-program/add-program.module').then( m => m.AddProgramPageModule)
  },
  {
    path: 'pages/add-campaign',
    loadChildren: () => import('./pages/add-campaign/add-campaign.module').then( m => m.AddCampaignPageModule)
  },
  {
  path: 'post-detail/:id',
  loadChildren: () => import('./pages/post-detail/post-detail.module').then( m => m.PostDetailPageModule)
},
{
  path: 'create-post',
  loadChildren: () => import('./pages/create-post/create-post.module').then( m => m.CreatePostPageModule)
},
  {
    // ===== BAGIAN YANG DIPERBAIKI =====
    path: 'admin/send-notification',
    loadChildren: () => import('./admin/notification-sender/notification-sender.module').then( m => m.NotificationSenderPageModule),
    canActivate: [AuthGuard] // <-- TAMBAHKAN SATPAM DI SINI
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'add-transaction',
    loadChildren: () => import('./pages/add-transaction/add-transaction.module').then( m => m.AddTransactionPageModule)
  },
  {
    path: 'add-program',
    loadChildren: () => import('./pages/add-program/add-program.module').then( m => m.AddProgramPageModule)
  },
  {
    path: 'add-campaign',
    loadChildren: () => import('./pages/add-campaign/add-campaign.module').then( m => m.AddCampaignPageModule)
  },
  {
    path: 'post-detail',
    loadChildren: () => import('./pages/post-detail/post-detail.module').then( m => m.PostDetailPageModule)
  },
  {
    path: 'create-post',
    loadChildren: () => import('./pages/create-post/create-post.module').then( m => m.CreatePostPageModule)
  },
  {
    path: 'create-article',
    loadChildren: () => import('./pages/create-article/create-article.module').then( m => m.CreateArticlePageModule)
  },
  {
    path: 'program-detail',
    loadChildren: () => import('./program-detail/program-detail.module').then( m => m.ProgramDetailPageModule)
  },
{
  path: 'program-detail/:id',
  loadChildren: () => import('./program-detail/program-detail.module').then( m => m.ProgramDetailPageModule)
},





  // Rute duplikat 'notification-sender' sudah dihapus karena tidak perlu
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}