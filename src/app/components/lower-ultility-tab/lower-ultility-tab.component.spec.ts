import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerUltilityTabComponent } from './lower-ultility-tab.component';

describe('LowerUltilityTabComponent', () => {
  let component: LowerUltilityTabComponent;
  let fixture: ComponentFixture<LowerUltilityTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LowerUltilityTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerUltilityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
