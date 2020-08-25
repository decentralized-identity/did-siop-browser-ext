import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDIDModalComponent } from './change-did-modal.component';

describe('ChangeDIDModalComponent', () => {
  let component: ChangeDIDModalComponent;
  let fixture: ComponentFixture<ChangeDIDModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeDIDModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDIDModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
