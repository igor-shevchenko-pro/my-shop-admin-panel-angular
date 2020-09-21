import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { accountEndpoints } from '../core/configurations/api-endpoints';
import { ContactTypeEnum } from '../core/api-models/base/enums';
import { ChangePasswordApiModel } from '../core/api-models/auth/change-password';
import { RecoveryPasswordApiModel } from '../core/api-models/auth/recovery-password';
import { RecoveryPasswordRequestApiModel } from '../core/api-models/auth/recovery-password-request';
import { LoginApiModel } from '../core/api-models/auth/login';
import { SignInResponseApiModel } from '../core/api-models/auth/signIn-response';
import { SuccessResponseApiModel } from '../core/api-models/base/success-response';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly _login = accountEndpoints.login;
  private readonly _recoveryPasswordRequest = accountEndpoints.recoveryPasswordRequest;
  private readonly _recoveryPassword = accountEndpoints.recoveryPassword;
  private readonly _changePassword = accountEndpoints.changePassword;


  constructor(private _httpClient: HttpClient,
              private _router: Router) { }


  public authentication(loginFormModel: FormGroup): Observable<SignInResponseApiModel> {

    let model: LoginApiModel = new LoginApiModel();
    model.login = loginFormModel.value.Login;
    model.password = loginFormModel.value.Password;
    model.contact_type = loginFormModel.value.ContactType

    return this._httpClient.post<SignInResponseApiModel>(this._login, model);
  }

  public recoveryPasswordRequest(recoveryPasswordRequestFormModel: FormGroup)
  : Observable<SuccessResponseApiModel> {

    let model: RecoveryPasswordRequestApiModel = new RecoveryPasswordRequestApiModel();
    model.contact = recoveryPasswordRequestFormModel.value.Email;
    model.contact_type = recoveryPasswordRequestFormModel.value.ContactType;
    model.front_client = recoveryPasswordRequestFormModel.value.FrontClientType;

    return this._httpClient.post<SuccessResponseApiModel>(this._recoveryPasswordRequest, model);
  }

  public recoveryPassword(contact: string, code: string, newPassword: string, contactType: ContactTypeEnum)
    : Observable<SuccessResponseApiModel> {

    let model: RecoveryPasswordApiModel = new RecoveryPasswordApiModel();
    model.contact = contact;
    model.code = code;
    model.new_password = newPassword;
    model.contact_type = contactType;

    return this._httpClient.post<SuccessResponseApiModel>(this._recoveryPassword, model);
  }

  public changePassword(changePasswordFormModel: FormGroup): Observable<SuccessResponseApiModel> {

    let model: ChangePasswordApiModel = new ChangePasswordApiModel();
    model.old_password = changePasswordFormModel.value.OldPassword;
    model.new_password = changePasswordFormModel.value.NewPassword;

    return this._httpClient.post<SuccessResponseApiModel>(this._changePassword, model);
  }

  public isLoggedIn(): boolean {
    if (localStorage.getItem('token') != null) {
      return true;
    }
    else {
      return false;
    }
  }

  public onLogout(): void {
    localStorage.removeItem('token');
    this._router.navigateByUrl('/account/login');
  }

}
