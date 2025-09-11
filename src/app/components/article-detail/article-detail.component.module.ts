import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ArticleDetailComponent } from './article-detail.component';

@NgModule({
  declarations: [ArticleDetailComponent],
  imports: [ CommonModule, IonicModule ],
  exports: [ArticleDetailComponent]
})
export class ArticleDetailComponentModule { }