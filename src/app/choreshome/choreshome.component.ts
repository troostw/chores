import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { User } from '../models.service';
import { Chore, newChore } from '../models/chore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-choreshome',
  templateUrl: './choreshome.component.html',
  styleUrls: ['./choreshome.component.css']
})
export class ChoreshomeComponent implements OnInit{
  /** Based on the screen size, switch from standard to one column per row 
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
  */

  userDoc: AngularFirestoreDocument<User>;
  assignedChoresObs: Observable<Chore[]>;
  assignedChores: Chore[];

  constructor(private breakpointObserver: BreakpointObserver, private afs: AngularFirestore, private auth: AuthService ) {
    
  }

  ngOnInit() {
    this.auth.user.subscribe(user => {
        console.log(`fetching user/${user.uid}` );
        this.userDoc = this.afs.doc<User>(`users/${user.uid}`);
        this.assignedChoresObs = this.userDoc.collection<Chore>('assignedChores').valueChanges();
        this.assignedChoresObs.subscribe(cha => {
          this.assignedChores = cha;
          console.log('got an array ', cha);
        });
        
    });
  }

}
