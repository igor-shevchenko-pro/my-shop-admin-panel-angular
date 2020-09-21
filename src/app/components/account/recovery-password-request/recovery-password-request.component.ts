import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { ToastService } from 'src/app/services/base/toast.service';
import { ContactTypeEnum, FrontClientTypeEnum } from 'src/app/core/api-models/base/enums';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './recovery-password-request.component.html',
  styleUrls: ['./recovery-password-request.component.css']
})
export class RecoveryPasswordRequestComponent implements OnInit {

  public blockedDocument: boolean = false;
  private _contactType: ContactTypeEnum = ContactTypeEnum.Email;
  private _frontClientType: FrontClientTypeEnum = FrontClientTypeEnum.AdminPanel;

  public formModel: FormGroup = this._formBuilder.group({
    Email: [null, [Validators.required, Validators.email]],
    ContactType: [null],
    FrontClientType: [null],
  });


  constructor(private _accountService: AccountService,
              private _formBuilder: FormBuilder,
              private _toastService: ToastService,
              private _router: Router) { }

  ngOnInit(): void {
    this.formModel.reset();
    // check authorization
    let isAuthorized: boolean = this._accountService.isLoggedIn();
    if (isAuthorized) this._router.navigateByUrl('/home');
  }


  public submitForm(): void {

    this.blockedDocument = true;
    this.formModel.controls['ContactType'].setValue(this._contactType);
    this.formModel.controls['FrontClientType'].setValue(this._frontClientType);

    this._accountService.recoveryPasswordRequest(this.formModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response === "success") {
          this.blockedDocument = false;
          this.formModel.reset();
          this._toastService.showSuccess("Success", "Ссылка для восстановления пароля отправлена на вашу почту", true, "recovery-password-request");
          // this._router.navigateByUrl('/account/login');
        }
      },
      errors => {
        // console.log(errors);
        this.blockedDocument = false;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'User is not found':
              this._toastService.showError("Error", "Пользователь с таким email не зарегистрирован", false, "recovery-password-request", 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка восстановления пароля", false, "recovery-password-request", 7000);
              break;
          }
        });
      }
    );

  }

}
