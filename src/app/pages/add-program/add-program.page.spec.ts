import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProgramPage } from './add-program.page';

describe('AddProgramPage', () => {
  let component: AddProgramPage;
  let fixture: ComponentFixture<AddProgramPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProgramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
