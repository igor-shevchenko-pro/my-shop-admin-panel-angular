import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { Router } from '@angular/router';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { BreadcrumbService } from 'src/app/services/base/bradcrumb.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent implements OnInit, OnDestroy {

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem;

  public supplierFormModel = this._formBuilder.group({
    Title: [null, Validators.required],
    Description: [null],
    Email: [null, [Validators.required, Validators.email]],
    ExtraEmail: [null, Validators.email],
    Phone: [null, [Validators.required, Validators.pattern("^[0-9]+$")]],
    ExtraPhone: [null, Validators.pattern("^[0-9]+$")],
    Manager: [null, Validators.required],
    ExtraManager: [null],
    Address: [null, Validators.required],
    ExtraAddress: [null],
    SomeInfo: [null],
    Фсешмшен: [true],
  });


  constructor(private _formBuilder: FormBuilder,
              private _breadcrumbService: BreadcrumbService,
              private _notifyService: NotificationService,
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


  public addSupplier(): void {
    // this.supplierFormModel.controls['LanguageId'].setValue(this._languageId);
    this._supplierService.add(this.supplierFormModel).subscribe(
      (res: SuccessResponseApiModel) => {
        console.log(res);
        if (res.response == "success") {
          this._notifyService.showSuccess("Поставщик создан успешно", "");

          const url = '/home/supplier/' + res.id;
          this._router.navigateByUrl(url);
        }
      },
      errors => {
        console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Duplicate name':
              this._notifyService.showError("Поставщик с таким названием уже существует", "");
              break;

            default:
              this._notifyService.showError("Ошибка добавления поставщика", "");
              break;
          }
        });
      }
    );
  }

}
