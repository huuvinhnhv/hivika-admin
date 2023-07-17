import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.css'],
})
export class EditGameComponent implements OnInit {
  game: any;
  formdata: any;
  alertMessage: string = '';
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditGameComponent>,
    @Inject(MAT_DIALOG_DATA) public dataID: any
  ) {}
  ngOnInit() {
    this.http
      .get<any>(
        'https://cdtkpmnc2023final.azurewebsites.net/api/Game/' + this.dataID.id
      )
      .subscribe((data) => {
        console.log('Get Game');
        console.log(data);
        this.game = data.data;
        // Update the form control values with the received event data
        this.formdata.patchValue({
          name: this.game.name,
          description: this.game.description,
        });
      });
    this.formdata = new FormGroup({
      name: new FormControl(''),
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
          'https://cdtkpmnc2023final.azurewebsites.net/api/Game/' +
            this.dataID.id,
          data
        )
        .subscribe((res) => {
          console.log(res);
          console.log('Edit successed');
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
