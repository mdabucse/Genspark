import { Component, signal } from '@angular/core';
import { RegisterModel } from '../model/register.model';
import { RegisterService } from '../service/register.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registermodel = signal(new RegisterModel());
  constructor (private registerservice: RegisterService){
    
  }
  handleRegisterClick(){
    console.log("Register Successfull");
    this.registerservice.registerApiCall(this.registermodel()).subscribe({
      next:(responce)=>{
        console.log(responce);
        alert("Registered Successfully");
      },
      error:(mess)=>{
        console.log(mess);
      }
    });
   }
}
