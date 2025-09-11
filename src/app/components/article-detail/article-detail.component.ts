import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewsArticle } from '../../services/content.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  standalone: false,
})
export class ArticleDetailComponent implements OnInit {
  @Input() article!: NewsArticle;
  constructor(private modalCtrl: ModalController) { }
  ngOnInit() {}
  dismissModal() {
    this.modalCtrl.dismiss();
  }
}