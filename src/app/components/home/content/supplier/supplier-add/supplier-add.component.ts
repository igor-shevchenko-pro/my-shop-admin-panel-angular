import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SupplierService } from 'src/app/services/supplier.service';
import { Router } from '@angular/router';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { BreadcrumbService } from 'src/app/services/base/bradcrumb.service';
import { MenuItem } from 'primeng/api';
import { ToastService } from 'src/app/services/base/toast.service';
import { UserLanguageEnum } from 'src/app/core/api-models/base/enums';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent implements OnInit, OnDestroy {

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem;
  public blockedDocument: boolean = false;
  private _languageId: UserLanguageEnum = UserLanguageEnum.Russian;

  public formModel = this._formBuilder.group({
    Title: [null, Validators.required],
    Description: [null, Validators.required],
    Email: [null, [Validators.required, Validators.email]],
    ExtraEmail: [null, Validators.email],
    Phone: [null, [Validators.required, Validators.pattern("^[0-9]+$")]],
    ExtraPhone: [null, Validators.pattern("^[0-9]+$")],
    Manager: [null, Validators.required],
    ExtraManager: [null],
    Address: [null, Validators.required],
    ExtraAddress: [null],
    SomeInfo: [null],
    Activity: [null],
    LanguageId: []
  });


  constructor(private _formBuilder: FormBuilder,
              private _breadcrumbService: BreadcrumbService,
              private _toastService: ToastService,
              private _supplierService: SupplierService,
              private _router: Router) { }

  ngOnInit(): void {
    // Breadcrumb start
    this._breadcrumbService.addBreadcrumbItem('Поставщики', '/suppliers');
    this._breadcrumbService.addBreadcrumbItem('Создать поставщика');
    this.breadcrumbItems = this._breadcrumbService.breadcrumbItems;
    this.breadcrumbHome = this._breadcrumbService.breadcrumbHome;
    // Breadcrumb finish
  }

  ngOnDestroy(): void {
    this._breadcrumbService.breadcrumbItems = [];
  }


  public submitForm(): void {
    this.blockedDocument = true;
    this.formModel.controls['LanguageId'].setValue(this._languageId);
    this._supplierService.add(this.formModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.blockedDocument = false;
          this._toastService.showSuccess("Success", "Поставщик успешно создан", false, 'add-supplier-component', 7000);
          // const url = '/home/supplier/' + res.id;
          // this._router.navigateByUrl(url);
        }
      },
      errors => {
        // console.log(errors);
        this.blockedDocument = false;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Duplicate name':
              this._toastService.showError("Error", "Поставщик с таким названием уже существует", false, 'add-supplier-component', 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка добавления поставщика", false, 'add-supplier-component', 7000);
              break;
          }
        });
      }
    );

  }

}
