// src/app/notifications/notifications.page.ts
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationItem, NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false
})
export class NotificationsPage implements OnInit {
  notifications$!: Observable<NotificationItem[]>;
  unreadCount$!: Observable<number>;

  constructor(
    private authService: AuthService,
    public notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.notifications$ = this.authService.currentUser$.pipe(
      switchMap(user => user ? this.notificationService.getUserNotifications(user.uid, 30) : of([]))
    );
    this.unreadCount$ = this.authService.currentUser$.pipe(
      switchMap(user => user ? this.notificationService.getUnreadCount(user.uid) : of(0))
    );
  }

  async markAllRead(items: NotificationItem[]) {
    await this.notificationService.markAllAsRead(items || []);
  }
}
