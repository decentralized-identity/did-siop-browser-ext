import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveKeyModalComponent } from './remove-key-modal.component';

describe('RemoveKeyModalComponent', () => {
  let component: RemoveKeyModalComponent;
  let fixture: ComponentFixture<RemoveKeyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveKeyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
