import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditchoreComponent } from './editchore.component';

describe('EditchoreComponent', () => {
  let component: EditchoreComponent;
  let fixture: ComponentFixture<EditchoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditchoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditchoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
