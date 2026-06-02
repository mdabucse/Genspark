import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../model/login.model';
import { LoginService } from '../service/login.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginmodel = signal(new LoginModel());
  constructor (private loginservice: LoginService){
    
  }
  handleLoginClick(){
    console.log("Login Successfull");
    this.loginservice.loginApiCall(this.loginmodel()).subscribe({
      next:(response)=>{
        console.log(response)
        alert("Login Successful")
      },
      error:(mess)=>{
        console.log(mess.error);
      },
    });
  }
}
