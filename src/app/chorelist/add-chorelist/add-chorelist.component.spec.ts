import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChorelistComponent } from './add-chorelist.component';

describe('AddChorelistComponent', () => {
  let component: AddChorelistComponent;
  let fixture: ComponentFixture<AddChorelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChorelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChorelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
