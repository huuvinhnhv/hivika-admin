import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddClientComponent } from '../dialog/add-client/add-client.component';
import { EditClientComponent } from '../dialog/edit-client/edit-client.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  listClients: any = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  constructor(private http: HttpClient, private dialog: MatDialog) {}
  ngOnInit() {
    this.http
      .get<any>('https://cdtkpmnc2023final.azurewebsites.net/api/GetAllClient')
      .subscribe((data) => {
        // console.log(data);
        this.listClients = data.data;
      });
  }
  getPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.listClients.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.listClients.length / this.itemsPerPage);
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  openAddClientDialog(): void {
    const dialogConfig: MatDialogConfig = {
      width: '800px',
      position: {
        left: '350px',
      },
    };

    const dialogRef = this.dialog.open(AddClientComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      // Handle the dialog close event here
      console.log('Dialog closed:', result);
    });
  }
  openConfirmDialog(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this item?',
      },
      position: {
        left: '500px',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User confirmed the delete action, perform the delete logic here
        // Call your delete method or service to delete the item
        console.log(id);
        this.http
          .delete<any>(
            'https://cdtkpmnc2023final.azurewebsites.net/api/Client/' + id
          )
          .subscribe((res) => {
            console.log(res);
            location.reload();
          });
        console.log('Delete success');
      }
    });
  }

  openEditClientDialog(id: any): void {
    const dialogConfig: MatDialogConfig = {
      width: '800px',
      position: {
        left: '350px',
      },
      data: { id: id },
    };

    const dialogRef = this.dialog.open(EditClientComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      // Handle the dialog close event here
      console.log('Dialog closed:', result);
    });
  }
}
