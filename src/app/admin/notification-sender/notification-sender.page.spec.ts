import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationSenderPage } from './notification-sender.page';

describe('NotificationSenderPage', () => {
  let component: NotificationSenderPage;
  let fixture: ComponentFixture<NotificationSenderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
