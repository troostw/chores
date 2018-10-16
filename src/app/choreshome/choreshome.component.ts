import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { User } from '../models.service';
import { Chore, ChoreInstance } from '../models/chore';
import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { MatDialog } from '@angular/material';
import { InviteComponent } from '../invite/invite.component';
import { Group } from '../models/group';

@Component({
  selector: 'app-choreshome',
  templateUrl: './choreshome.component.html',
  styleUrls: ['./choreshome.component.css']
})
export class ChoreshomeComponent implements OnInit {

  userDoc: AngularFirestoreDocument<User>;
  choresObs: Observable<Chore[]>;
  choreInstancesObs: Observable<ChoreInstance[]>;
  chores: Chore[];
  choreInstances: ChoreInstance[];
  people: any[];
  public selectedAssigned: string;
  public selectionCount: number;
  private groupid: string; //todo there are many groups on the page!!! change the page in sections per group.
  private user: User;

  constructor(private breakpointObserver: BreakpointObserver,
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog) {

  }

  ngOnInit() {
    this.selectedAssigned = "invite";
    this.selectionCount = 0;
    this.auth.user.subscribe(user => {

      this.user = user;

      const groups = this.afs.collection<Group>('groups', ref => ref.where('memberslist', 'array-contains', user.uid)).snapshotChanges()
        .pipe(map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Group;
            const id = a.payload.doc.id;
            this.groupid = id; //handle the various groupids here.
            return { id, ...data };
          }))
        );
      const instanceObs = [];

      groups.subscribe(grps => {
        grps.map(grp => {
          const instances = this.afs.collection<ChoreInstance>(`groups/${grp.id}/choreInstances`, ref => ref.where('choreDate', '>=', new Date())).snapshotChanges()
            .pipe(map(actions =>
              actions.map(a => {
                const data = a.payload.doc.data() as ChoreInstance;
                const id = a.payload.doc.id;
                console.log('data: ', data);
                return { id, ...data };
              }))
            );

          instanceObs.push(instances);
        });
        console.log("here is the merge", instanceObs.length);
        this.choreInstancesObs = merge<ChoreInstance[]>(...instanceObs)
        // .subscribe(instances => {
        //   this.choreInstances = instances;
        // })

      })

      this.userDoc = this.afs.doc<User>(`users/${user.uid}`);
      this.people = [{ name: 'Me', uid: user.uid }];
      this.people.push({ name: "Invite someone", uid: "invite" });
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

  addChore() {
    this.router.navigate(['choreedit', 'new']);
  }

  handleAssigned(event) {
    console.log("going to handle ", event);
    const dialogRef = this.dialog.open(InviteComponent, {
      width: '250px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: `, result);
      if (result.invite) {
        result.inviter =  this.user.displayName;

        const inviteArgs = { data: {
          inviter: result.inviter,
          invitee: result.emailaddress,
          groupid: this.groupid 
        } }

        console.log('inviteArgs:', inviteArgs);
        this.http.post('https://us-central1-chores-217518.cloudfunctions.net/doInvite', inviteArgs)
        .subscribe(data => {
          console.log('reponse data ', data);
        });  
      }
    });
  }

  selectionChanged(event) {
    console.log('selectionChanged ', event);
    if (event.checked) {
      this.selectionCount++;
    } else {
      this.selectionCount--;
    }
  }

}
