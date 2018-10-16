import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitecompleteComponent } from './invitecomplete.component';

describe('InvitecompleteComponent', () => {
  let component: InvitecompleteComponent;
  let fixture: ComponentFixture<InvitecompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitecompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitecompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
