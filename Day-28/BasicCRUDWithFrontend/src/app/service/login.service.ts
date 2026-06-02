import { HttpClient } from "@angular/common/http";
import { LoginModel } from "../model/login.model";
import { Injectable } from "@angular/core";
import { baseUrl } from "../constents";

@Injectable({
    providedIn: 'root'
})
export class LoginService{
    constructor(private http: HttpClient){

    }
    public loginApiCall(loginModel: LoginModel) {
        let url = baseUrl+'/login';
        return this.http.post(url, loginModel, { responseType: 'text' });
    }
}