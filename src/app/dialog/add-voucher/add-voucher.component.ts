import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.css'],
})
export class AddVoucherComponent implements OnInit {
  listGames: any;
  formdata: any;
  alertMessage: string = '';
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddVoucherComponent>
  ) {}

  ngOnInit() {
    this.http
      .get<any>('https://cdtkpmnc2023final.azurewebsites.net/api/GetAllGame')
      .subscribe((data) => {
        console.log(data);
        this.listGames = data.data;
      });
    this.formdata = new FormGroup({
      name: new FormControl(''),
      code: new FormControl(''),
      gameId: new FormControl(''),
      // discount: new FormControl(''),
      // userId: new FormControl(''),
      eventId: new FormControl(0),
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
          'https://cdtkpmnc2023final.azurewebsites.net/api/Voucher',
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
