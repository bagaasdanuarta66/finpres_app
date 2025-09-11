import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BeritaPageRoutingModule } from './berita-routing.module';
import { BeritaPage } from './berita.page';
import { ArticleDetailComponentModule } from '../components/article-detail/article-detail.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeritaPageRoutingModule,
    ArticleDetailComponentModule
  ],
  declarations: [BeritaPage]
})
export class BeritaPageModule {}