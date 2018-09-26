
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreshomeComponent } from './choreshome.component';

describe('ChoreshomeComponent', () => {
  let component: ChoreshomeComponent;
  let fixture: ComponentFixture<ChoreshomeComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoreshomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoreshomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
