import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { User } from '../models.service';
import { Chore, ChoreInstance } from '../models/chore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-choreshome',
  templateUrl: './choreshome.component.html',
  styleUrls: ['./choreshome.component.css']
})
export class ChoreshomeComponent implements OnInit{
 
  userDoc: AngularFirestoreDocument<User>;
  choresObs: Observable<Chore[]>;
  choreInstancesObs: Observable<ChoreInstance[]>;
  chores: Chore[];
  choreInstances: ChoreInstance[];

  constructor(private breakpointObserver: BreakpointObserver, 
    private afs: AngularFirestore, 
    private auth: AuthService,
    private router: Router,
    private http: HttpClient ) {
    
  }

  ngOnInit() {
    this.auth.user.subscribe(user => {
        console.log(`fetching user/${user.uid}` );
        this.userDoc = this.afs.doc<User>(`users/${user.uid}`);
        this.choresObs = this.userDoc.collection<Chore>('chores').valueChanges();
        this.choresObs.subscribe(cha => {
          this.chores = cha;
        });

        this.choreInstancesObs = this.afs.collection<ChoreInstance>('choreInstances').valueChanges();
        this.choreInstancesObs.subscribe(cha => {
          this.choreInstances = cha;
        });
        
    });
  }

  addChore(){
    this.router.navigate(['choreedit','new']);
  }

  sendVerifyEmail(){
    console.log('here we should go');
    this.http.post('https://us-central1-chores-217518.cloudfunctions.net/sendVerifyEmail',{data:{}})
    .subscribe(data => {
      console.log('reponse data ', data);
    });
  }

}
