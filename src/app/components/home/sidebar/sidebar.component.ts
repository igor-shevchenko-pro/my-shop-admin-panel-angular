import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';
import { AccountService } from 'src/app/services/account.service';
import { Validators, FormBuilder } from '@angular/forms';
import { ToastService } from 'src/app/services/base/toast.service';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() public userFullName: string;
  @Input() public userPhotoUrl: string;
  @Input() public userId: string;
  public blockedDocument: boolean = false;
  public displayModalChangePassword: boolean;
  public accountService: AccountService;

  public formModel = this._formBuilder.group({
    OldPassword: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    NewPassword: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
  });


  constructor(private _accountService: AccountService,
              private _formBuilder: FormBuilder,
              private _toastService: ToastService) {
    this.accountService = _accountService;
  }

  ngOnInit(): void {
    // bugFix of opening WidgetTreeview
    $('[data-widget="treeview"]').each(function () {
      AdminLte.Treeview._jQueryInterface.call($(this), 'init');
      AdminLte.Layout._jQueryInterface.call($('body'));
      AdminLte.PushMenu._jQueryInterface.call($('[data-widget="pushmenu"]'));
    });
  }


  public showModalDialogChangePassword(): void {
    this.formModel.reset();
    this.displayModalChangePassword = true;
  }

  public submitForm(): void {
    this.blockedDocument = true;
    this._accountService.changePassword(this.formModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        this.blockedDocument = false;
        this.displayModalChangePassword = false;
        if (res.response == "success") {
          this._toastService.showSuccess("Success", "Пароль успешно изменен", false, "password-reset-sidebar", 7000);
        }
      },
      errors => {
        // console.log(errors);
        this.blockedDocument = false;
        this.formModel.reset();
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'User is not found':
              this._toastService.showError("Error", "Неверный старый пароль", false, "password-reset-sidebar", 7000);
              break;
            case 'New password can\'t be the same as the old one':
              this._toastService.showWarn("Warning", "Новый пароль не может быть таким как старый", false, "password-reset-sidebar", 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка обновления пароля", false, "password-reset-sidebar", 7000);
              break;
          }
        });
      }
    );

  }

}
