import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMatchedUserComponent } from './modal-matched-user.component';

describe('ModalMatchedUserComponent', () => {
  let component: ModalMatchedUserComponent;
  let fixture: ComponentFixture<ModalMatchedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMatchedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMatchedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
