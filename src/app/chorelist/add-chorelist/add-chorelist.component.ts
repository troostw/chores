import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../../auth.service';
import { debounceTime, tap } from 'rxjs/operators';
import { Chorelist } from '../../models.service';
import { Chore } from '../../models/chore';


@Component({
  selector: 'app-add-chorelist',
  templateUrl: './add-chorelist.component.html',
  styleUrls: ['./add-chorelist.component.css']
})
export class AddChorelistComponent implements OnInit {

  chorelistForm: FormGroup;
  listItemsForm: FormGroup;
  chorelistid: string;
  chlDocument: AngularFirestoreDocument<Chorelist> ;
  choresCollection: AngularFirestoreCollection<Chore>;

  get chores() {
    return this.listItemsForm.get('chores') as FormArray;
  }

  constructor(private fb: FormBuilder,
    private afs: AngularFirestore,
    private auth: AuthService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.chorelistForm = this.fb.group({
      listName: ['', Validators.required],
      owner: ['']
    });

    this.listItemsForm = this.fb.group({
      chores: this.fb.array([])
    });

    this.chorelistid = this.route.snapshot.paramMap.get('chorelistid');

    this.auth.user.subscribe(user => {
      console.log(`fetching chorelist for user/${user.uid}`);
      this.chlDocument = this.afs.doc<Chorelist>(`users/${user.uid}/chorelists/${this.chorelistid}`);
      this.choresCollection = this.afs.collection<Chore>(`users/${user.uid}/chorelists/${this.chorelistid}/chores`)

      this.chlDocument.valueChanges().pipe(
        tap(data => {
          this.chorelistForm.patchValue(data)
        })
      )
      .subscribe()

    });

    this.chorelistForm.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(formValue => {
      console.log("new form values ", formValue);
      this.chlDocument.set(formValue);
    });
  }

  addChore() {
    this.chores.push(
      this.fb.group({
        chorelist: [''],
        choreName: ['', Validators.required],
        choreWeight: ['']
      })
    );
  }

}
