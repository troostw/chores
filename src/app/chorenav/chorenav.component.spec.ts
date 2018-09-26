
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChorenavComponent } from './chorenav.component';

describe('ChorenavComponent', () => {
  let component: ChorenavComponent;
  let fixture: ComponentFixture<ChorenavComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [ChorenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChorenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
