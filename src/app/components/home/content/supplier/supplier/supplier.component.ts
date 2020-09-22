import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from 'src/app/services/supplier.service';
import { SupplierGetMinApiModel } from 'src/app/core/api-models/supplier';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/services/base/bradcrumb.service';
import { TypeModelResponseEnum } from 'src/app/core/api-models/base/enums';
import { ToastService } from 'src/app/services/base/toast.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit, OnDestroy {

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem;
  public blockedDocument: boolean = false;

  public id: string;
  public title: string;
  public webSite: string;
  public email: string;
  public extraEmail: string;
  public phone: string;
  public extraPhone: string;
  public manager: string;
  public extraManager: string;
  public address: string;
  public extraAddress: string;
  public description: string;
  public someInfo: string;
  public activity: number;


  constructor(private _actRoute: ActivatedRoute,
              private _supplierService: SupplierService,
              private _router: Router,
              private _confirmationService: ConfirmationService,
              private _toastService: ToastService,
              private _breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    // *** Breadcrumb start
    this._breadcrumbService.addBreadcrumbItem('Поставщики', '/suppliers');
    this._breadcrumbService.addBreadcrumbItem('Профиль поставщика');
    this.breadcrumbItems = this._breadcrumbService.breadcrumbItems;
    this.breadcrumbHome = this._breadcrumbService.breadcrumbHome;
    // *** Finish

    this.id = this._actRoute.snapshot.params.id;
    this.get();
  }

  ngOnDestroy(): void {
    this._breadcrumbService.breadcrumbItems = [];
  }


  public delete(): void {
    this._confirmationService.confirm({
      message: 'Вы действительно хотите удалить поставщика <b>' + this.title + '<b>?',
      header: 'Подтвердить',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedDocument = true;
        this._supplierService.delete(this.id).subscribe(
          (res: SuccessResponseApiModel) => {
            // console.log(res);
            this.blockedDocument = false;
            if (res.response == "success") {
              this._toastService.showSuccess('Success', 'Поставщик ' + this.title + ' удален успешно', false, 'app-component', 7000);
            }
            this._router.navigateByUrl('/home/suppliers');
          },
          errors => {
            // console.log(errors);
            this.blockedDocument = false;
            errors.error.errors.forEach(element => {
              switch (element) {
                case 'Entity is not found':
                  this._toastService.showSuccess('Error', 'Поставщик не найден', false, 'supplier-component', 7000);
                  break;

                default:
                  this._toastService.showError("Error", "Ошибка удаления поставщика", false, 'supplier-component', 7000);
                  break;
              }
            });
          }
        );
      }
    });
  }

  private get(): void {
    this._supplierService.getById(this.id, TypeModelResponseEnum.GetMinApiModel).subscribe(
      (res: SupplierGetMinApiModel) => {
        // console.log(res);
        if (res == null) {
          this._router.navigateByUrl('/home/suppliers');
          return;
        }
        this.title = res.title;
        this.webSite = res.website;
        this.email = res.email;
        this.extraEmail = res.extra_email;
        this.phone = res.phone;
        this.extraPhone = res.extra_phone;
        this.manager = res.manager;
        this.extraManager = res.extra_manager;
        this.address = res.address;
        this.extraAddress = res.extra_address;
        this.description = res.description;
        this.someInfo = res.some_info;
        this.activity = res.activity_status;
      },
      errors => {
        // console.log(errors);
        this._router.navigateByUrl('/home/suppliers');
      }
    );
  }

}
