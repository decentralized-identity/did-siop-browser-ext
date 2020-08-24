import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDataModalComponent } from './test-data-modal.component';

describe('TestDataModalComponent', () => {
  let component: TestDataModalComponent;
  let fixture: ComponentFixture<TestDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
