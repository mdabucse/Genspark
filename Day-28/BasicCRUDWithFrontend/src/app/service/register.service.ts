import { HttpClient } from "@angular/common/http";
import { RegisterModel } from "../model/register.model";
import { baseUrl } from "../constents";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class RegisterService{
    constructor(private http: HttpClient){

    }
    public registerApiCall(registerModel: RegisterModel) {
            let url = baseUrl+'/register';
            return this.http.post(url, registerModel);
    }
}