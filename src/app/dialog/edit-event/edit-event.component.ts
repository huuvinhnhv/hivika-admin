import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  listClients: any;
  event: any;
  formdata: any;
  alertMessage: string = '';
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditEventComponent>,
    @Inject(MAT_DIALOG_DATA) public dataID: any
  ) {}
  ngOnInit() {
    this.http
      .get<any>('https://cdtkpmnc2023final.azurewebsites.net/api/GetAllClient')
      .subscribe((data) => {
        console.log(data);
        this.listClients = data.data;
      });
    this.http
      .get<any>(
        'https://cdtkpmnc2023final.azurewebsites.net/api/Event/' +
          this.dataID.id
      )
      .subscribe((data) => {
        console.log('Get event');
        console.log(data);
        this.event = data.data;
        // Update the form control values with the received event data
        this.formdata.patchValue({
          name: this.event.name,
          startDate: this.event.startDate,
          endDate: this.event.endDate,
          clientId: this.event.clientId,
          description: this.event.description,
        });
      });
    this.formdata = new FormGroup({
      name: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      clientId: new FormControl(''),
      description: new FormControl(''),
    });

    console.log('Received id:', this.dataID.id);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  saveData(data: any) {
    if (this.formdata.valid) {
      if (this.formdata.value.startDate < this.formdata.value.endDate) {
        this.http
          .put<any>(
            'https://cdtkpmnc2023final.azurewebsites.net/api/Event/' +
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
        this.alertMessage = 'Start Date cannot be greater than end Date.';
        console.log('warning date');
      }
    } else {
      this.alertMessage = 'Please fill in all required fields.';
      console.log('warning required fill');
    }
  }
}
