import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { UrlSegment, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chorenav',
  templateUrl: './chorenav.component.html',
  styleUrls: ['./chorenav.component.css']
})
export class ChorenavComponent {

  currentUrl: Array<UrlSegment>;

  get onRoot():boolean {

    return (this.router.routerState.snapshot.url === '/');

  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private auth: AuthService, private router: Router, private location: Location) {

  }

  goBack(){
    this.location.back();
  }

}
