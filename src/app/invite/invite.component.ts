import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  public inviteForm: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<InviteComponent>) { }

  ngOnInit() {
    this.inviteForm = this.fb.group({
      email: ['']
    });
  }

  doInvite(){
    console.log("Going to do invite");
    this.dialogRef.close({invite: true, emailaddress: this.inviteForm.get('email').value});
  }

  doCancel(){
    console.log("Going to do cancel");
    this.dialogRef.close({invite: false});
  }
}
