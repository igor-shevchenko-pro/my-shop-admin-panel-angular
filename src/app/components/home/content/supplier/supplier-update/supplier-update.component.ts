import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SupplierService } from 'src/app/services/supplier.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierGetMinApiModel } from 'src/app/core/api-models/supplier';
import { TypeModelResponseEnum, UserLanguageEnum } from 'src/app/core/api-models/base/enums';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/services/base/bradcrumb.service';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { ToastService } from 'src/app/services/base/toast.service';

@Component({
  selector: 'app-supplier-update',
  templateUrl: './supplier-update.component.html',
  styleUrls: ['./supplier-update.component.css']
})
export class SupplierUpdateComponent implements OnInit, OnDestroy {

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem;
  public blockedDocument: boolean = false;
  private _languageId: UserLanguageEnum = UserLanguageEnum.Russian;
  private _id: string;

  public formModel = this._formBuilder.group({
    Id: [null],
    Title: [null, Validators.required],
    Website: [null],
    Email: [null, [Validators.required, Validators.email]],
    ExtraEmail: [null, Validators.email],
    Phone: [null, [Validators.required, Validators.pattern("^[0-9]+$")]],
    ExtraPhone: [null, Validators.pattern("^[0-9]+$")],
    Manager: [null, Validators.required],
    ExtraManager: [null],
    Address: [null, Validators.required],
    ExtraAddress: [null],
    Description: [null, Validators.required],
    SomeInfo: [null],
    Activity: [null],
    LanguageId: []
  });


  constructor(private _formBuilder: FormBuilder,
              private _breadcrumbService: BreadcrumbService,
              private _supplierService: SupplierService,
              private _toastService: ToastService,
              private _actRoute: ActivatedRoute,
              private _router: Router) { }

  ngOnInit(): void {
    // Breadcrumb start
    this._breadcrumbService.addBreadcrumbItem('Поставщики', '/suppliers');
    this._breadcrumbService.addBreadcrumbItem('Редактировать поставщика');
    this.breadcrumbItems = this._breadcrumbService.breadcrumbItems;
    this.breadcrumbHome = this._breadcrumbService.breadcrumbHome;
    // Breadcrumb finish

    this._id = this._actRoute.snapshot.params.id;
    this.get();
  }

  ngOnDestroy(): void {
    this._breadcrumbService.breadcrumbItems = [];
  }


  public submitForm(): void {
    this.blockedDocument = true;
    this.formModel.controls['Id'].setValue(this._id);
    this.formModel.controls['LanguageId'].setValue(this._languageId);
    this._supplierService.update(this.formModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.blockedDocument = false;
          // this._toastService.showSuccess("Success", 'Поставщик ' + this.formModel.get('Title').value + ' создан отредактирован', false, 'app-component', 7000);
          const url = '/home/supplier/' + this._id;
          this._router.navigateByUrl(url);
        }
      },
      errors => {
        console.log(errors);
        this.blockedDocument = false;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._toastService.showError("Error", "Поставщик не найден", false, 'update-supplier-component', 7000);
              break;
            case 'Duplicate name':
              this._toastService.showError("Error", "Поставщик с таким названием уже существует", false, 'update-supplier-component', 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка редактирования поставщика", false, 'update-supplier-component', 7000);
              break;
          }
        });
      }
    );
  }


  private get(): void {
    this._supplierService.getById(this._id, TypeModelResponseEnum.GetMinApiModel).subscribe(
      (res: SupplierGetMinApiModel) => {
        // console.log(res);
        if (res == null) {
          this._router.navigateByUrl('/home/suppliers');
          return;
        }
        this.formModel.controls['Title'].setValue(res.title);
        this.formModel.controls['Website'].setValue(res.website);
        this.formModel.controls['Email'].setValue(res.email);
        this.formModel.controls['ExtraEmail'].setValue(res.extra_email);
        this.formModel.controls['Phone'].setValue(res.phone);
        this.formModel.controls['ExtraPhone'].setValue(res.extra_phone);
        this.formModel.controls['Manager'].setValue(res.manager);
        this.formModel.controls['ExtraManager'].setValue(res.extra_manager);
        this.formModel.controls['Address'].setValue(res.address);
        this.formModel.controls['ExtraAddress'].setValue(res.extra_address);
        this.formModel.controls['Description'].setValue(res.description);
        this.formModel.controls['SomeInfo'].setValue(res.some_info);
        this.formModel.controls['Activity'].setValue(res.activity_status);
      },
      errors => {
        // console.log(errors);
        this._router.navigateByUrl('/home/suppliers');
      }
    );
  }

}
