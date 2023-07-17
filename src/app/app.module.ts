import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientsComponent } from './clients/clients.component';
import { EventsComponent } from './events/events.component';
import { GamesComponent } from './games/games.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { HttpClientModule } from '@angular/common/http';
import { AddEventComponent } from './dialog/add-event/add-event.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { EditEventComponent } from './dialog/edit-event/edit-event.component';
import { AddClientComponent } from './dialog/add-client/add-client.component';
import { EditClientComponent } from './dialog/edit-client/edit-client.component';
import { AddGameComponent } from './dialog/add-game/add-game.component';
import { EditGameComponent } from './dialog/edit-game/edit-game.component';
import { AddVoucherComponent } from './dialog/add-voucher/add-voucher.component';
import { EditVoucherComponent } from './dialog/edit-voucher/edit-voucher.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import myAppConfig from './config/my-app-config';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './shared/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    EventsComponent,
    GamesComponent,
    VouchersComponent,
    AddEventComponent,
    ConfirmDialogComponent,
    EditEventComponent,
    AddClientComponent,
    EditClientComponent,
    AddGameComponent,
    EditGameComponent,
    AddVoucherComponent,
    EditVoucherComponent,
    SignInComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(myAppConfig.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
  ],
  providers: [MatDatepickerModule, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
