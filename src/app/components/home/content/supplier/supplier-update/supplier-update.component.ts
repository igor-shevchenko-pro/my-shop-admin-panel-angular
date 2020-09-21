import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierGetMinApiModel } from 'src/app/core/api-models/supplier';
import { EntityActivityStatusEnum } from 'src/app/core/api-models/base/enums';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';

@Component({
  selector: 'app-supplier-update',
  templateUrl: './supplier-update.component.html',
  styleUrls: ['./supplier-update.component.css']
})
export class SupplierUpdateComponent implements OnInit {

  private _languageId: number = 1;
  private _supplierId: string;

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
    LanguageId: [null],
    Status: [true],
  });


  constructor(private _formBuilder: FormBuilder,
              private _notifyService: NotificationService,
              private _supplierService: SupplierService,
              private _actRoute: ActivatedRoute,
              private _router: Router) { }

  ngOnInit(): void {
    this._supplierId = this._actRoute.snapshot.params.id;
    this.getSupplier();
  }


  public updateSupplier(): void {
    this.supplierFormModel.controls['LanguageId'].setValue(this._languageId);
    // this._supplierService.update(this._supplierId, this.supplierFormModel).subscribe(
    //   (res: SuccessResponseApiModel) => {
        // console.log(res);
        // if (res.response == "success") {
          // this._notifyService.showSuccess("Поставщик обновлен успешно", "");\
      //     const url = '/home/supplier/' + this._supplierId;
      //     this._router.navigateByUrl(url);
      //   }
      // },
      // errors => {
        // console.log(errors);
        // errors.error.errors.forEach(element => {
        //   switch (element) {
        //     case 'Duplicate name':
        //       this._notifyService.showError("Поставщик с таким названием уже существует", "");
        //       break;

        //     default:
        //       this._notifyService.showError("Ошибка добавления поставщика", "");
        //       break;
        //   }
        // });
      // }
    // );
  }


  private getSupplier(): void {
    // this._supplierService.getById(this._supplierId).subscribe(
    //   (res: SupplierGetMinApiModel) => {
        // console.log(res);
      //   this.supplierFormModel.controls['Title'].setValue(res.title);
      //   this.supplierFormModel.controls['Description'].setValue(res.description);
      //   this.supplierFormModel.controls['Email'].setValue(res.email);
      //   this.supplierFormModel.controls['ExtraEmail'].setValue(res.extra_email);
      //   this.supplierFormModel.controls['Phone'].setValue(res.phone);
      //   this.supplierFormModel.controls['ExtraPhone'].setValue(res.extra_phone);
      //   this.supplierFormModel.controls['Manager'].setValue(res.manager);
      //   this.supplierFormModel.controls['ExtraManager'].setValue(res.extra_manager);
      //   this.supplierFormModel.controls['Address'].setValue(res.address);
      //   this.supplierFormModel.controls['ExtraAddress'].setValue(res.extra_address);
      //   this.supplierFormModel.controls['SomeInfo'].setValue(res.some_info);
      //   this.supplierFormModel.controls['Status'].setValue(this.GetActivityStatus(res.activity_status));
      // },
      // errors => {
        // console.log(errors);
    //     this._router.navigateByUrl('/home/suppliers');
    //   }
    // );
  }

  private GetActivityStatus(status: EntityActivityStatusEnum): boolean {
    switch (status) {
      case EntityActivityStatusEnum.Inactive:
        return true;
      case EntityActivityStatusEnum.Inactive-2:
        return false;

      default:
        return true;
    }
  }

}
