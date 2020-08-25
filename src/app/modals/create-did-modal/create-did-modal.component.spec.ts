import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDIDModalComponent } from './create-did-modal.component';

describe('CreateDIDModalComponent', () => {
  let component: CreateDIDModalComponent;
  let fixture: ComponentFixture<CreateDIDModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDIDModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDIDModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
