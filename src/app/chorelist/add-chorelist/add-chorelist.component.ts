import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, 
  AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, take, tap } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { Chorelist, User } from '../../models.service';
import { Chore, newChore } from '../../models/chore';


@Component({
  selector: 'app-add-chorelist',
  templateUrl: './add-chorelist.component.html',
  styleUrls: ['./add-chorelist.component.css']
})
export class AddChorelistComponent implements OnInit {
  user: User;
  chorelistForm: FormGroup;
  // listItemsForm: FormGroup;
  choresForms: Array<FormGroup>;
  chorelistid: string;
  chlDocument: AngularFirestoreDocument<Chorelist> ;
  choresCollection: AngularFirestoreCollection<Chore>;

  // get chores() {
  //   return this.listItemsForm.get('chores') as FormArray;
  // }

  constructor(private fb: FormBuilder,
    private afs: AngularFirestore,
    private auth: AuthService,
    private route: ActivatedRoute) {

  }

  
  ngOnInit() {
    this.chorelistid = this.route.snapshot.paramMap.get('chorelistid');
    this.chorelistForm = this.fb.group({
      listName: ['', Validators.required],
      owner: [''],
      chorelistid: [this.chorelistid]
    });

    // this.listItemsForm = this.fb.group({
    //   chores: this.fb.array([])
    // });
    this.choresForms = [];

    this.auth.user.subscribe(user => {
      this.user = user;
      console.log(`fetching chorelist for user/${user.uid}`);
      this.chlDocument = this.afs.doc<Chorelist>(`users/${user.uid}/chorelists/${this.chorelistid}`);
      this.choresCollection = this.afs.collection<Chore>(`users/${user.uid}/chorelists/${this.chorelistid}/chores`)

      this.chlDocument.valueChanges().pipe(
        tap(data => {
          data.chorelistid = this.chorelistid;
          this.chorelistForm.patchValue(data)
        })
      )
      .subscribe();

      this.choresCollection.snapshotChanges().pipe(take(1)).subscribe(actions => {
        console.log("here");
        actions.map(dca_a => {
          console.log("there");
          const ch:any = dca_a.payload.doc.data();
          this.addFormForChore(ch);
        })
      });
      

    });

    this.chorelistForm.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(formValue => {
      console.log("new form values ", formValue);
      this.chlDocument.set(formValue);
    });
  }

  addFormForChore(ch: Chore){
    const fg = this.fb.group({
      choreid: [ch.choreid],
      chorelist: [ch.chorelist],
      choreName: [ch.choreName, Validators.required],
      choreWeight: [ch.choreWeight]
    });

    fg.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(formValue => {
      console.log("new chore form values ", formValue);
      this.saveChore(formValue);
    });

    this.choresForms.push(fg);
  }

  addChore() {

    let ch:Chore = newChore();
    ch.chorelist = this.chorelistid;
    ch.choreWeight = 10;
    this.chlDocument.collection<Chore>('chores').add(ch)
    .then(ref => {
      ch.choreid = ref.id;
      ch.choreName = '';
      ch.choreWeight = 10;
      this.addFormForChore(ch);
      // const fg = this.fb.group({
      //   choreid: [ch.choreid],
      //   chorelist: [ch.chorelist],
      //   choreName: ['', Validators.required],
      //   choreWeight: [10]
      // });
  
      // fg.valueChanges.pipe(
      //   debounceTime(1000)
      // ).subscribe(formValue => {
      //   console.log("new chore form values ", formValue);
      //   this.saveChore(formValue);
      // });
  
      // this.choresForms.push(fg);
    })
  }

  saveChore(ch: Chore){
    this.afs.doc<Chore>(`users/${this.user.uid}/chorelists/${this.chorelistid}/chores/${ch.choreid}`).set(ch);
  }

}
