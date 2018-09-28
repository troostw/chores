import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChorelisthomeComponent } from './chorelisthome.component';

describe('ChorelisthomeComponent', () => {
  let component: ChorelisthomeComponent;
  let fixture: ComponentFixture<ChorelisthomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChorelisthomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChorelisthomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
