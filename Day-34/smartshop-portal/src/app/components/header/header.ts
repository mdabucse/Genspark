import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  user: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.authService.user$
      .subscribe(user => {
        this.user = user;
      });

  }

  logout() {

    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
