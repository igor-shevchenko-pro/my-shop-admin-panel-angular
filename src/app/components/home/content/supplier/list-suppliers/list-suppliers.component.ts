import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/services/supplier.service';
import { EntityActivityStatusEnum, SupplierSortingEnum, TypeModelResponseEnum } from 'src/app/core/api-models/base/enums';
import { SupplierGetMinApiModel } from 'src/app/core/api-models/supplier';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/base/toast.service';
import { BreadcrumbService } from 'src/app/services/base/bradcrumb.service';

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.css']
})
export class ListSuppliersComponent implements OnInit, OnDestroy {

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem;
  public blockedDocument: boolean = false;
  public totalRecords: number;
  public deleteLabel: string;
  public lazyLoading: boolean;
  public supplierAddDialogOpen: boolean;
  public supplierUpdateDialogOpen: boolean;
  public suppliers: Array<SupplierGetMinApiModel>;
  public selectedSuppliers: Array<SupplierGetMinApiModel>;
  public start: number = 0;
  public query: string;
  private _count: number = 0;
  private _sortField: string;
  private _sortOrder: number;

  // Needs for correct displaying first page after changing sortedField or sortOrder
  private _sortFieldVisited: string;
  private _sortOrderVisited: number;

  public addSupplierFormModel = this._formBuilder.group({
    Title: [null, Validators.required],
    Description: [null, Validators.required],
    Email: [null, Validators.required, Validators.email],
    ExtraEmail: [null, Validators.email],
    Phone: [null, [Validators.required, Validators.pattern("^[0-9]+$")]],
    ExtraPhone: [null, Validators.pattern("^[0-9]+$")],
    Manager: [null, Validators.required],
    ExtraManager: [null],
    Address: [null, Validators.required],
    ExtraAddress: [null],
    SomeInfo: [null],
    Activity: [null],
  });

  public updateSupplierFormModel = this._formBuilder.group({
    Id: [''],
    Title: ['', Validators.required],
    Activity: [null]
  });

  public searchFilterFormModel = new FormGroup({
    query: new FormControl(),
  });


  constructor(private _supplierService: SupplierService,
              private _toastService: ToastService,
              private _formBuilder: FormBuilder,
              private _confirmationService: ConfirmationService,
              private _breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.lazyLoading = true;
    // Breadcrumb start
    this._breadcrumbService.addBreadcrumbItem('Поставщики');
    this.breadcrumbItems = this._breadcrumbService.breadcrumbItems;
    this.breadcrumbHome = this._breadcrumbService.breadcrumbHome;
    // Breadcrumb finish
  }

  ngOnDestroy(): void {
    this._breadcrumbService.breadcrumbItems = [];
  }


  public getAll(event: LazyLoadEvent = null): void {

    this.lazyLoading = true;
    this.paginationSupportHandler(event);

    this._supplierService.getAll(this.start, this._count, TypeModelResponseEnum.GetMinApiModel,
      this._sortField, this._sortOrder, this.query).subscribe(
        (res: PaginationResponseApiModel<SupplierGetMinApiModel, SupplierSortingEnum>) => {
          // console.log(res);
          this.lazyLoading = false;
          if (res.models.length > 0) {
            this.totalRecords = res.total;
            this.suppliers = res.models;
          } else {
            this.totalRecords = 0;
            this.suppliers = null;
          }
        },
        errors => {
          // console.log(errors);
        }
      );
  }

  public update(): void {
    this.blockedDocument = true;
    this._supplierService.update(this.updateSupplierFormModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.blockedDocument = false;
          this.supplierUpdateDialogOpen = false;
          this.updateSupplierFormModel.reset();
          this.getAll();
        }
      },
      errors => {
        // console.log(errors);
        this.blockedDocument = false;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._toastService.showError("Error", "Поставщик не найден", false, 'supplier-component', 7000);
              break;
            case 'Duplicate name':
              this._toastService.showError("Error", "Поставщик с таким названием уже существует", false, 'supplier-component', 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка обновления поставщика", false, 'supplier-component', 7000);
              break;
          }
        });
      }
    );
  }

  public changeActivityStatus(id: string, event): void {
    let activityStatus: EntityActivityStatusEnum = this.parseActivityStatus(event.checked);
    this._supplierService.changeActivityStatus(id, activityStatus).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.getAll();
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._toastService.showSuccess('Error', 'Поставщик не найден', false, 'supplier-component', 7000);
              break;

            default:
              this._toastService.showSuccess('Error', 'Ошибка изменения статуса активности', false, 'supplier-component', 7000);
              break;
          }
        });
      }
    );
  }

  public delete(supplier: SupplierGetMinApiModel): void {
    this._confirmationService.confirm({
      message: 'Вы действительно хотите удалить поставщика <b>' + supplier.title + '<b>?',
      header: 'Подтвердить',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedDocument = true;
        this._supplierService.delete(supplier.id).subscribe(
          (res: SuccessResponseApiModel) => {
            // console.log(res);
            this.blockedDocument = false;
            if (res.response == "success") {
              this.getAll();
              this._toastService.showSuccess('Success', 'Поставщик ' + supplier.title + ' удален успешно', false, 'supplier-component', 7000);
            }
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

  public deleteSelected(): void {
    this._confirmationService.confirm({
      message: 'Вы действительно хотите удалить выбранных поставщиков?',
      header: 'Подтвердить',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedDocument = true;
        this._supplierService.deleteRange(this.selectedSuppliers).subscribe(
          (res: SuccessResponseApiModel) => {
            // console.log(res);
            this.blockedDocument = false;
            this.selectedSuppliers = null;
            if (res.response == "success") {
              this._toastService.showSuccess('Success', 'Выбранные поставщики удалены успешно', false, 'supplier-component', 7000);
              this.getAll();
            }
          },
          errors => {
            // console.log(errors);
            this.blockedDocument = false;
            errors.error.errors.forEach(element => {
              switch (element) {
                case 'Entity is not found':
                  this._toastService.showError('Error', 'Поставщик не найден', false, 'supplier-component', 7000);
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


  // *** Support methods for main flow start
  public getActivityStatus(activityStatus: number): boolean {
    switch (activityStatus) {
      case 1:
        return true;
      case 0:
        return false;

      default:
        return true;
    }
  }

  private parseActivityStatus(status: boolean): EntityActivityStatusEnum {
    if (status == true) return EntityActivityStatusEnum.Active;
    if (status == false) return EntityActivityStatusEnum.Inactive;
  }
  // *** Support methods for main flow finish


  // *** Pagination support methods start
  private paginationSupportHandler(event: LazyLoadEvent = null): void {
    // *** Pagination Settings start
    // Needs for correct display first page after changing sortedField or sortOrder
    if (event != null) {
      this._count = event?.rows;
      this.query = event?.globalFilter;
      this.start = event?.first;
      if ((event?.sortField != undefined || event?.sortField != null) &&
        (this._sortFieldVisited != event?.sortField || this._sortOrderVisited != event?.sortOrder)) {
        this._sortFieldVisited = event?.sortField;
        this._sortOrderVisited = event?.sortOrder;
        this.start = 0;
      }
    }

    if (event == null) {
      this._sortField = this._sortFieldVisited;
      this._sortOrder = this._sortOrderVisited;
    } else {
      this._sortField = event?.sortField;
      this._sortOrder = event?.sortOrder;
    }
    // *** Pagination Settings finish
  }

  public searchInputClear(): void {
    this.searchFilterFormModel.setValue({ query: null });
    this.query = null;
    this._sortFieldVisited = null;
    this._sortOrderVisited = null;
  }
  // *** Pagination support methods finish


  // *** ModalDialog support methods start
  public openSupplierModalDialog(modalDialog: string, role: SupplierGetMinApiModel = null): void {
    if (modalDialog == "supplierAddDialog") {
      this.supplierAddDialogOpen = true;
      this.addSupplierFormModel.reset();
    }
    if (modalDialog == "supplierUpdateDialog") {
      this.supplierUpdateDialogOpen = true;
      this.updateSupplierFormModel.reset();

      // set values for supplierUpdateForm
      this.updateSupplierFormModel.controls['Id'].setValue(role.id);
      this.updateSupplierFormModel.controls['Title'].setValue(role.title);
      this.updateSupplierFormModel.controls['Activity'].setValue(role.activity_status);
    }
  }

  public closeSupplierModalDialog(modalDialog: string): void {
    if (modalDialog == "supplierAddDialog") {
      this.supplierAddDialogOpen = false;
      this.addSupplierFormModel.reset();
    }
    if (modalDialog == "supplierUpdateDialog") {
      this.supplierUpdateDialogOpen = false;
      this.updateSupplierFormModel.reset();
    }
  }
  // *** ModalDialog support methods finish

}
