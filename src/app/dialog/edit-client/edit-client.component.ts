import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css'],
})
export class EditClientComponent implements OnInit {
  client: any;
  formdata: any;
  alertMessage: string = '';
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public dataID: any
  ) {}
  ngOnInit() {
    this.http
      .get<any>(
        'https://cdtkpmnc2023final.azurewebsites.net/api/Client/' +
          this.dataID.id
      )
      .subscribe((data) => {
        console.log('Get client');
        console.log(data);
        this.client = data.data;
        // Update the form control values with the received event data
        this.formdata.patchValue({
          clientName: this.client.clientName,
          phoneNumber: this.client.phoneNumber,
          address: this.client.address,
          description: this.client.description,
        });
      });
    this.formdata = new FormGroup({
      clientName: new FormControl(''),
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      description: new FormControl(''),
    });

    console.log('Received id:', this.dataID.id);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  saveData(data: any) {
    if (this.formdata.valid) {
      this.http
        .put<any>(
          'https://cdtkpmnc2023final.azurewebsites.net/api/Client/' +
            this.dataID.id,
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
