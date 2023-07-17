import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css'],
})
export class AddClientComponent implements OnInit {
  formdata: any;
  alertMessage: string = '';
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddClientComponent>
  ) {}

  ngOnInit() {
    this.formdata = new FormGroup({
      clientName: new FormControl(''),
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      description: new FormControl(''),
    });
  }
  // Add any necessary methods or properties for your dialog functionality

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveData(data: any) {
    if (this.formdata.valid) {
      this.http
        .post<any>(
          'https://cdtkpmnc2023final.azurewebsites.net/api/CreateNewClient',
          data
        )
        .subscribe((res) => {
          console.log(res);
          console.log('Add successed');
          location.reload();
        });
      // Once the data is saved, you can close the dialog
      this.closeDialog();
    } else {
      this.alertMessage = 'Please fill in all required fields.';
      console.log('warning required fill');
    }
  }
}
