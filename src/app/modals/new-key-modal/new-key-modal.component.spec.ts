import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewKeyModalComponent } from './new-key-modal.component';

describe('NewKeyModalComponent', () => {
  let component: NewKeyModalComponent;
  let fixture: ComponentFixture<NewKeyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewKeyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
