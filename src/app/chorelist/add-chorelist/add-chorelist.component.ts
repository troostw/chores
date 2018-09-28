import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-add-chorelist',
  templateUrl: './add-chorelist.component.html',
  styleUrls: ['./add-chorelist.component.css']
})
export class AddChorelistComponent implements OnInit {

  chorelistForm: FormGroup;



  get chores() {
    return this.chorelistForm.get('chores') as FormArray;
  }

  constructor(private fb: FormBuilder,
    private afs: AngularFirestore,
    private auth: AuthService) {

  }

  ngOnInit() {
    this.chorelistForm = this.fb.group({
      listName: ['', Validators.required],
      owner: [''],
      chores: this.fb.array([])
    });


    this.auth.user.subscribe(user => {
      console.log(`fetching user/${user.uid}`);
      this.chorelistForm.get('owner').setValue(user.displayName)
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

  onSubmit() {
    console.warn(this.chorelistForm.value);
  }

}
