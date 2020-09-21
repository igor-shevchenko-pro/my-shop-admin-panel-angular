import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ToastService } from 'src/app/services/base/toast.service';
import { ContactTypeEnum } from 'src/app/core/api-models/base/enums';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';

@Component({
  selector: 'app-reset-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css']
})
export class RecoveryPasswordComponent implements OnInit {

  public blockedDocument: boolean = false;
  private _code: string;
  private _contact: string;
  private _contactType: ContactTypeEnum = ContactTypeEnum.Email;

  public formModel = this._formBuilder.group({
    Passwords: this._formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })
  });


  constructor(private _accountService: AccountService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _actRoute: ActivatedRoute,
              private _toastService: ToastService) {

    this._code = this._actRoute.snapshot.params.code;
    this._contact = this._actRoute.snapshot.params.contact;
  }

  ngOnInit(): void {
    this.formModel.reset();
    // check authorization
    let isAuthorized: boolean = this._accountService.isLoggedIn();
    if (isAuthorized) this._router.navigateByUrl('/home');
  }


  public submitForm(): void {

    this.blockedDocument = true;
    let newPassword = this.formModel.value.Passwords.Password;

    this._accountService.recoveryPassword(this._contact, this._code, newPassword, this._contactType).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        this.blockedDocument = false;
        if (res.response === "success") {
          this.formModel.reset();
          this._toastService.showSuccess("Success", "Пароль успешно изменен", true, "recovery-password");
          // this._router.navigateByUrl('/account/login');
        }
      },
      errors => {
        // console.log(errors);
        this.blockedDocument = false;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'User is not found':
              this._toastService.showError("Error", "Пользоветь не найден", false, "recovery-password", 7000);
              break;
            case 'New password can\'t be the same as the old one':
              this._toastService.showWarn("Warning", "Новый пароль не может быть таким как старый", false, "recovery-password", 7000);
              break;
            case 'The recovery password link is expired':
              this._toastService.showError("Error", "Срок действия ссылки истек. Отправьте повторный запрос", false, "recovery-password", 7000);
              break;
            case 'The recovery password link invalid':
              this._toastService.showError("Error", "Ссылка не действительна", false, "recovery-password", 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка восстановления пароля", false, "recovery-password", 7000);
              break;
          }
        });
      }
    );
    
  }

  
  private comparePasswords(form: FormGroup): void {

    let confirmPswdCtrl = form.get('ConfirmPassword');
    if (confirmPswdCtrl.errors == null || 'passwordMismatch' in confirmPswdCtrl.errors) {
      if (form.get('Password').value != confirmPswdCtrl.value) {
        confirmPswdCtrl.setErrors({ passwordMismatch: true });
      } else {
        confirmPswdCtrl.setErrors(null);
      }
    }

  }

}