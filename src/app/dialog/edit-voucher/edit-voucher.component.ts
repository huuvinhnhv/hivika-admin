import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: ['./edit-voucher.component.css'],
})
export class EditVoucherComponent implements OnInit {
  game: any = {};
  voucher: any;
  formdata: any;
  alertMessage: string = '';
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditVoucherComponent>,
    @Inject(MAT_DIALOG_DATA) public dataID: any
  ) {}
  ngOnInit() {
    this.http
      .get<any>(
        'https://cdtkpmnc2023final.azurewebsites.net/api/Voucher/' +
          this.dataID.id
      )
      .subscribe((data) => {
        console.log('Get voucher');
        console.log(data);
        this.voucher = data.data;
        // Update the form control values with the received event data
        this.formdata.patchValue({
          name: this.voucher.name,
          code: this.voucher.code,
          gameId: this.voucher.gameId,
          discount: this.voucher.discount,
          userId: this.voucher.userId,
          eventId: this.voucher.eventId,
        });
        this.http
          .get<any>(
            'https://cdtkpmnc2023final.azurewebsites.net/api/Game/' +
              this.voucher.gameId
          )
          .subscribe((data) => {
            console.log(data);
            this.game = data.data;
          });
      });
    this.formdata = new FormGroup({
      name: new FormControl(''),
      code: new FormControl(''),
      gameId: new FormControl(''),
      discount: new FormControl(''),
      userId: new FormControl(''),
      eventId: new FormControl(0),
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
          'https://cdtkpmnc2023final.azurewebsites.net/api/Voucher/' +
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
