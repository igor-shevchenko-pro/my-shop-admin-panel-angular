import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { EntityActivityStatusEnum, RoleSortingEnum, TypeModelResponseEnum } from 'src/app/core/api-models/base/enums';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { RoleGetFullApiModel } from 'src/app/core/api-models/user-account/role';
import { BreadcrumbService } from 'src/app/services/base/bradcrumb.service';
import { ToastService } from 'src/app/services/base/toast.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, OnDestroy {

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem;
  public blockedDocument: boolean = false;
  public totalRecords: number;
  public deleteLabel: string;
  public lazyLoading: boolean;
  public roleAddDialogOpen: boolean;
  public roleUpdateDialogOpen: boolean;
  public roles: Array<RoleGetFullApiModel>;
  public selectedRoles: Array<RoleGetFullApiModel>;
  public start: number = 0;
  public query: string;
  private _count: number = 0;
  private _sortField: string;
  private _sortOrder: number;

  // Needs for correct displaying first page after changing sortedField or sortOrder
  private _sortFieldVisited: string;
  private _sortOrderVisited: number;

  public addRoleFormModel = this._formBuilder.group({
    Title: ['', Validators.required],
    Activity: [null],
  });

  public updateRoleFormModel = this._formBuilder.group({
    Id: [''],
    Title: ['', Validators.required],
    Activity: [null]
  });

  public searchFilterFormModel = new FormGroup({
    query: new FormControl(),
  });


  constructor(private _roleService: RoleService,
              private _formBuilder: FormBuilder,
              private _toastService: ToastService,
              private _confirmationService: ConfirmationService,
              private _breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.lazyLoading = true;
    // Breadcrumb start
    this._breadcrumbService.addBreadcrumbItem('Роли');
    this.breadcrumbItems = this._breadcrumbService.breadcrumbItems;
    this.breadcrumbHome = this._breadcrumbService.breadcrumbHome;
    // Breadcrumb finish
  }

  ngOnDestroy(): void {
    this._breadcrumbService.breadcrumbItems = [];
  }


  public getAllWithNestedManagers(event: LazyLoadEvent = null): void {

    this.lazyLoading = true;
    this.paginationSupportHandler(event);

    this._roleService.getAllWithNestedManagers(this.start, this._count, TypeModelResponseEnum.GetFullApiModel,
      this._sortField, this._sortOrder, this.query).subscribe(
        (res: PaginationResponseApiModel<RoleGetFullApiModel, RoleSortingEnum>) => {
          // console.log(res);
          this.lazyLoading = false;
          if (res.models.length > 0) {
            this.totalRecords = res.total;
            this.roles = res.models;
          } else {
            this.totalRecords = 0;
            this.roles = null;
          }
        },
        errors => {
          // console.log(errors);
        }
      );
  }

  public add(): void {
    this.blockedDocument = true;
    this._roleService.add(this.addRoleFormModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.blockedDocument = false;
          this.roleAddDialogOpen = false;
          this.addRoleFormModel.reset();
          this._toastService.showSuccess("Success", "Роль успешно создана", false, 'role-component', 7000);
          this.getAllWithNestedManagers();
        }
      },
      errors => {
        // console.log(errors);
        this.blockedDocument = false;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Duplicate name':
              this._toastService.showError("Error", "Роль с таким названием уже существует", false, 'role-component', 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка добавления роли", false, 'role-component', 7000);
              break;
          }
        });
      }
    );

  }

  public update(): void {
    this.blockedDocument = true;
    this._roleService.update(this.updateRoleFormModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.blockedDocument = false;
          this.roleUpdateDialogOpen = false;
          this.updateRoleFormModel.reset();
          this.getAllWithNestedManagers();
        }
      },
      errors => {
        // console.log(errors);
        this.blockedDocument = false;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._toastService.showError("Error", "Роль не найдена", false, 'role-component', 7000);
              break;
            case 'Duplicate name':
              this._toastService.showError("Error", "Роль с таким названием уже существует", false, 'role-component', 7000);
              break;

            default:
              this._toastService.showError("Error", "Ошибка обновления роли", false, 'role-component', 7000);
              break;
          }
        });
      }
    );
  }

  public changeActivityStatus(id: string, event): void {
    let activityStatus: EntityActivityStatusEnum = this.parseActivityStatus(event.checked);
    this._roleService.changeActivityStatus(id, activityStatus).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.getAllWithNestedManagers();
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._toastService.showSuccess('Error', 'Роль не найдена', false, 'role-component', 7000);
              break;

            default:
              this._toastService.showSuccess('Error', 'Ошибка изменения статуса', false, 'role-component', 7000);
              break;
          }
        });
      }
    );
  }

  public delete(role: RoleGetFullApiModel): void {
    this._confirmationService.confirm({
      message: 'Вы действительно хотите удалить роль <b>' + role.title + '<b>?',
      header: 'Подтвердить',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedDocument = true;
        this._roleService.delete(role.id).subscribe(
          (res: SuccessResponseApiModel) => {
            // console.log(res);
            this.blockedDocument = false;
            if (res.response == "success") {
              this.getAllWithNestedManagers();
              this._toastService.showSuccess('Success', 'Роль ' + role.title + ' удалена успешно', false, 'role-component', 7000);
            }
          },
          errors => {
            // console.log(errors);
            this.blockedDocument = false;
            errors.error.errors.forEach(element => {
              switch (element) {
                case 'Entity is not found':
                  this._toastService.showSuccess('Error', 'Роль не найдена', false, 'role-component', 7000);
                  break;

                default:
                  this._toastService.showError("Error", "Ошибка удаления роли", false, 'role-component', 7000);
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
      message: 'Вы действительно хотите удалить выбранные роли?',
      header: 'Подтвердить',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedDocument = true;
        this._roleService.deleteRange(this.selectedRoles).subscribe(
          (res: SuccessResponseApiModel) => {
            // console.log(res);
            this.blockedDocument = false;
            this.selectedRoles = null;
            if (res.response == "success") {
              this._toastService.showSuccess('Success', 'Выбранные роли удалены успешно', false, 'role-component', 7000);
              this.getAllWithNestedManagers();
            }
          },
          errors => {
            // console.log(errors);
            this.blockedDocument = false;
            errors.error.errors.forEach(element => {
              switch (element) {
                case 'Entity is not found':
                  this._toastService.showSuccess('Error', 'Роль не найдена', false, 'role-component', 7000);
                  break;

                default:
                  this._toastService.showError("Error", "Ошибка удаления роли", false, 'role-component', 7000);
                  break;
              }
            });
          }
        );
      }
    });
  }


  // *** Support methods for main flow start
  public getActivityStatus(status: number): boolean {
    switch (status) {
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
  public openRoleModalDialog(modalDialog: string, role: RoleGetFullApiModel = null): void {
    if (modalDialog == "roleAddDialog") {
      this.roleAddDialogOpen = true;
      this.addRoleFormModel.reset();
    }
    if (modalDialog == "roleUpdateDialog") {
      this.roleUpdateDialogOpen = true;
      this.updateRoleFormModel.reset();

      // set values for roleUpdateForm
      this.updateRoleFormModel.controls['Id'].setValue(role.id);
      this.updateRoleFormModel.controls['Title'].setValue(role.title);
      this.updateRoleFormModel.controls['Activity'].setValue(role.activity_status);
    }
  }

  public closeRoleModalDialog(modalDialog: string): void {
    if (modalDialog == "roleAddDialog") {
      this.roleAddDialogOpen = false;
      this.addRoleFormModel.reset();
    }
    if (modalDialog == "roleUpdateDialog") {
      this.roleUpdateDialogOpen = false;
      this.updateRoleFormModel.reset();
    }
  }
  // *** ModalDialog support methods finish

}