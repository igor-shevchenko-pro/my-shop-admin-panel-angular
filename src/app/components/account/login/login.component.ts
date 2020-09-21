import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ToastService } from 'src/app/services/base/toast.service';
import { ContactTypeEnum } from 'src/app/core/api-models/base/enums';
import { SignInResponseApiModel } from 'src/app/core/api-models/auth/signIn-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  public blockedDocument: boolean = false;
  private _contactType: ContactTypeEnum = ContactTypeEnum.Email;

  public formModel = this._formBuilder.group({
    Login: [null, [Validators.required, Validators.email]],
    Password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    ContactType: [null],
  });


  constructor(private _accountService: AccountService,
              private _toastService: ToastService,
              private _formBuilder: FormBuilder,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.formModel.reset();
    // check authentication
    let isAuthorized: boolean = this._accountService.isLoggedIn();
    if (isAuthorized) this._router.navigateByUrl('/home');
  }


  public submitForm(): void {

    this.blockedDocument = true;
    this.formModel.controls['ContactType'].setValue(this._contactType);

    this._accountService.authentication(this.formModel).subscribe(
      (res: SignInResponseApiModel) => {
        // console.log(res);
        this.blockedDocument = false;
        if (res.id != null && res.token != null) {
          this.formModel.reset();
          localStorage.setItem('token', res.token);
          this._router.navigateByUrl('/home');
        }
      },
      errors => {
        // console.log(errors);
        this.blockedDocument = false;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Login or password is not valid':
              this._toastService.showError('Error', 'Введен неверный логин или пароль', false, "login", 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка аутентификации", false, "login", 7000);
              break;
          }
        });
      }
    );

  }

}