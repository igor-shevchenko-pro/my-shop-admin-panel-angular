import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from 'src/app/services/supplier.service';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplierGetMinApiModel } from 'src/app/core/api-models/supplier';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  public supplierId: string;
  public title: string;
  public description: string;
  public email: string;
  public extraEmail: string;
  public phone: string;
  public extraPhone: string;
  public manager: string;
  public extraManager: string;
  public address: string;
  public extraAddress: string;
  public someInfo: string;
  public supplierStatus: boolean = true;


  constructor(private _actRoute: ActivatedRoute,
              private _supplierService: SupplierService,
              private _router: Router,
              private _notifyService: NotificationService,
              private _modalService: NgbModal) { }

  ngOnInit(): void {
    this.supplierId = this._actRoute.snapshot.params.id;
    this.getSupplier();
  }


  public deleteSupplier(): void {
    this._modalService.dismissAll();
    this._supplierService.delete(this.supplierId).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this._notifyService.showSuccess("Поставщик удален успешно", "");
          this._router.navigateByUrl('/home/suppliers');
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._notifyService.showError("Поставщик не найден", "Ошибка удаления поставщика");
              break;

            default:
              this._notifyService.showError("Ошибка удаления поставщика", "");
              break;
          }
        });
      }
    );
  }

  public openModal(content): void {
    this._modalService.open(content);
  }


  private getSupplier(): void {
    this._supplierService.getById(this.supplierId, null).subscribe(
      (res: SupplierGetMinApiModel) => {
        // console.log(res);
        this.title = res.title;
        this.description = res.description;
        this.email = res.email;
        this.extraEmail = res.extra_email;
        this.phone = res.phone;
        this.extraPhone = res.extra_phone;
        this.manager = res.manager;
        this.extraManager = res.extra_manager;
        this.address = res.address;
        this.extraAddress = res.extra_address;
        this.someInfo = res.some_info;
        if (res.activity_status == 1) this.supplierStatus = false;
      },
      errors => {
        // console.log(errors);
        this._router.navigateByUrl('/home/suppliers');
      }
    );
  }

}
