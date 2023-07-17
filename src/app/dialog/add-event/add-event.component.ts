import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
})
export class AddEventComponent implements OnInit {
  listClients: any;
  formdata: any;
  alertMessage: string = '';
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddEventComponent>
  ) {}

  ngOnInit() {
    this.http
      .get<any>('https://cdtkpmnc2023final.azurewebsites.net/api/GetAllClient')
      .subscribe((data) => {
        console.log(data);
        this.listClients = data.data;
      });
    this.formdata = new FormGroup({
      name: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      clientId: new FormControl(''),
      description: new FormControl(''),
    });
  }
  // Add any necessary methods or properties for your dialog functionality

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveData(data: any) {
    if (this.formdata.valid) {
      if (this.formdata.value.startDate < this.formdata.value.endDate) {
        this.http
          .post<any>(
            'https://cdtkpmnc2023final.azurewebsites.net/api/Event',
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
        this.alertMessage = 'Start Date cannot be greater than end Date.';
        console.log('warning date');
      }
    } else {
      this.alertMessage = 'Please fill in all required fields.';
      console.log('warning required fill');
    }
  }
}
