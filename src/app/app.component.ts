import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'myApp';
  className = 'events';

  isAuthenticated: boolean = false;
  userName: string = '';
  storage: Storage = sessionStorage;
  constructor(public authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.authService.authStatusListener();
    this.authService.currentAuthStatus.subscribe((authStatus) => {
      this.isAuthenticated = authStatus;

      // this.userName = authStatus.email;
      // this.storage.setItem('userEmail', JSON.stringify(authStatus.email));
    });
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
    if (pageName == 'dashboard') {
      this.className = 'dashboard';
    }
    if (pageName == 'events') {
      this.className = 'events';
    }
    if (pageName == 'clients') {
      this.className = 'clients';
    }
    if (pageName == 'games') {
      this.className = 'games';
    }
    if (pageName == 'vouchers') {
      this.className = 'vouchers';
    }
  }
}
