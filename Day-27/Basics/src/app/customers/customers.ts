import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerModel } from '../models/customer.model';

@Component({
  standalone: true,
  selector: 'app-customers',
  imports: [FormsModule],
  templateUrl: './customers.html',
  styleUrls: ['./customers.css'],
})
export class Customers {

  customerName:string = "hehe";
  color:string = "blue";
  styleclass:string = "tableclass";
    //customer:CustomerModel = new CustomerModel("johndoe", "John Doe", "john.doe@example.com", "123-456-7890", "active", new Date());
  customer:CustomerModel = new CustomerModel();
  handleChangeClick(){
    alert("Customer Name: " + this.customerName);
  }

}