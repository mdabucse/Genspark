import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  username ='';
  password = '';

  constructor(private authService:AuthService,private router:Router){}

  login(){
    const credentails = {
      username:this.username,
      password:this.password
    }
    this.authService.login(credentails).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        console.error(e);
        alert('Invalid Credentials');
      }
    })
  }
}
