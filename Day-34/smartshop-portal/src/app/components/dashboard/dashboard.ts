import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  user: any;
  constructor(private authService:AuthService) {
    this.authService.user$.subscribe(
      user =>{
        this.user = user;
      }
    )

  }

}
