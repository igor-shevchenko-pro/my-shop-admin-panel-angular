import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/file.service';
import { EntityActivityStatusEnum, TypeModelResponseEnum, UserSortingEnum } from 'src/app/core/api-models/base/enums';
import { UserGetFullApiModel } from 'src/app/core/api-models/user-account/user';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';
import { ConfirmationService, LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/services/base/bradcrumb.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/base/toast.service';

@Component({
  selector: 'app-list-managers',
  templateUrl: './list-managers.component.html',
  styleUrls: ['./list-managers.component.css']
})
export class ListManagersComponent implements OnInit, OnDestroy {

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem;
  public blockedDocument: boolean = false;
  public lazyLoading: boolean;
  public totalRecords: number;
  public start: number = 0;
  public query: string;
  public sortPlaceholder: string = "";
  private _count: number = 0;
  private _sortField: string;
  private _sortOrder: number;
  private _userIdsWhenLoadedAvatar: string[] = [];

  // Needs for correct displaying first page after changing sortedField or sortOrder
  private _sortFieldVisited: string;
  private _sortOrderVisited: number;

  products: Product[];
  sortOrder: number;
  sortField: string;
  public sortOptions: SelectItem[];
  sortKey: string;

  public managers: Array<UserGetFullApiModel>;
  public userRoles: string;

  status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];
  productNames: string[] = [
    "Bamboo Watch",
    "Black Watch",
    "Blue Band",
    "Blue T-Shirt",
    "Bracelet",
    "Brown Purse",
    "Chakra Bracelet",
    "Galaxy Earrings",
    "Game Controller",
    "Gaming Set",
    "Gold Phone Case",
    "Green Earbuds",
    "Green T-Shirt",
    "Grey T-Shirt",
    "Headphones",
    "Light Green T-Shirt",
    "Lime Band",
    "Mini Speakers",
    "Painted Phone Case",
    "Pink Band",
    "Pink Purse",
    "Purple Band",
    "Purple Gemstone Necklace",
    "Purple T-Shirt",
    "Shoes",
    "Sneakers",
    "Teal T-Shirt",
    "Yellow Earbuds",
    "Yoga Mat",
    "Yoga Set",
  ];


  getProducts() {
    return this.http.get<any>('assets/products.json')
      .toPromise()
      .then(res => <Product[]>res.data)
      .then(data => { return data; });
  }


  constructor(private _userService: UserService,
              private http: HttpClient,
              private _modalService: NgbModal,
              private _router: Router,
              private _breadcrumbService: BreadcrumbService,
              private _toastService: ToastService,
              private _confirmationService: ConfirmationService,
              private _fileService: FileService) {
              this.managers = new Array<UserGetFullApiModel>();
  }

  ngOnInit(): void {
    // Breadcrumb start
    this._breadcrumbService.addBreadcrumbItem('Менеджеры');
    this.breadcrumbItems = this._breadcrumbService.breadcrumbItems;
    this.breadcrumbHome = this._breadcrumbService.breadcrumbHome;
    // Breadcrumb finish
    this.getManagers();

    this.getProducts().then(data => this.products = data);
    // Dropdown sortings start
    this.sortOptions = [
      { label: 'Дата начала работы 🔼', value: 'created' },
      { label: 'Дата начала работы 🔽', value: '!created' },
      { label: 'Статус активности 🔼', value: 'activity_status' },
      { label: 'Статус активности 🔽', value: '!activity_status' },
      { label: 'По имени 🔼', value: 'first_name' },
      { label: 'По имени 🔽', value: '!first_name' },
      { label: 'По фамилии 🔼', value: 'second_name' },
      { label: 'По фамилии 🔽', value: '!second_name' },
    ];
    // Dropdown sortings finish
  }

  ngOnDestroy(): void {
    this._breadcrumbService.breadcrumbItems = [];
    this._userIdsWhenLoadedAvatar = [];
  }


  public getManagers(event: LazyLoadEvent = null, sortField: string = null, sortOrder: number = null): void {

    // console.log(event);

    this.lazyLoading = true;
    this.paginationSupportHandler(event);
    if(sortField != null && sortOrder != null){
      this._sortField = sortField;
      this._sortOrder = sortOrder;
    }
    let tempRoles: Array<string> = new Array<string>();

    this._userService.getManagers(this.start, this._count, TypeModelResponseEnum.GetFullApiModel,
      this._sortField, this._sortOrder, this.query).subscribe(
        (res: PaginationResponseApiModel<UserGetFullApiModel, UserSortingEnum>) => {
          // console.log(res);
          if (res.models.length > 0) {
            this.lazyLoading = false;
            this.totalRecords = res.total;
            res.models.forEach(element => {
              element.roles.forEach(item => {
                tempRoles.push(item.title);
              });
              element.roles_for_view = tempRoles.join(' / ');
              tempRoles = new Array<string>();
            });
          } else {
            this.totalRecords = 0;
          }
          this.managers = res.models;
        },
        errors => {
          // console.log(errors);
        }
      );
  }

  public delete(manager: UserGetFullApiModel): void {
    this._confirmationService.confirm({
      message: 'Вы действительно хотите удалить менеджера <b>' + manager.user_profile.first_name + " " + manager.user_profile.second_name + '<b>?',
      header: 'Подтвердить',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedDocument = true;
        this._userService.delete(manager.id).subscribe(
          (res: SuccessResponseApiModel) => {
            // console.log(res);
            this.blockedDocument = false;
            if (res.response == "success") {
              this.getManagers();
              this._toastService.showSuccess('Success', 'Менеджер ' + manager.user_profile.first_name + " " + manager.user_profile.second_name + ' удален успешно', false, 'user-list-component', 7000);
              //delete USER'S FILE
              this._fileService.delete(manager.user_profile.file_id).subscribe(
                (res: SuccessResponseApiModel) => {
                  // console.log();
                },
                errors => {
                  // console.log(errors);
                }
              );
            }
          },
          errors => {
            // console.log(errors);
            this.blockedDocument = false;
            errors.error.errors.forEach(element => {
              switch (element) {
                case 'Entity is not found':
                  this._toastService.showSuccess('Error', 'Менеджер не найден', false, 'user-list-component', 7000);
                  break;

                default:
                  this._toastService.showError("Error", "Ошибка удаления менеджера", false, 'user-list-component', 7000);
                  break;
              }
            });
          }
        );
      }
    });
  }

  public openModal(content, userId = null, fileId = null) {
    // this._userId = userId;
    // this._fileId = fileId;
    this._modalService.open(content);
  }

  public getManagerStatus(status: number): boolean {
    switch (status) {
      case 0:
        return true;
      case 1:
        return false;

      default:
        return true;
    }
  }

  public onChangeStatus(id: number, $event): void {
    // console.log($event);
    let status: EntityActivityStatusEnum;
    if ($event == true) status = EntityActivityStatusEnum.Inactive;
    if ($event == false) status = EntityActivityStatusEnum.Inactive - 2;

    this._userService.changeStatus(id, status).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          // this._notifyService.showSuccess("Статус изменен успешно", "");
          this.getManagers();
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              // this._notifyService.showError("Менеджер не найден", "Ошибка изменения статуса");
              break;

            default:
              // this._notifyService.showError("Ошибка изменения статуса", "");
              break;
          }
        });
      }
    );
  }

  public redirectToProfile(id: string): void {
    const url = '/home/manager/' + id;
    this._router.navigateByUrl(url);
  }

  // Sorting handler 
  public onSortChange(event): void {

    let value = event.value;
    let sortField: string;
    let sortOrder: number;
    
    if(value == "created"){
      sortField = "created";
      sortOrder = 1;
    } 
    else if(value == "!created"){
      sortField = "created";
      sortOrder = -1;
    } 
    else if(value == "activity_status"){
      sortField = "activity_status";
      sortOrder = 1;
    } 
    else if(value == "!activity_status"){
      sortField = "activity_status";
      sortOrder = -1;
    } 
    else if(value == "first_name"){
      sortField = "first_name";
      sortOrder = 1;
    } 
    else if(value == "!first_name"){
      sortField = "first_name";
      sortOrder = -1;
    } 
    else if(value == "second_name"){
      sortField = "second_name";
      sortOrder = 1;
    } 
    else if(value == "!second_name"){
      sortField = "second_name";
      sortOrder = -1;
    } else {
      sortField = "created";
      sortOrder = -1;
    }

    this.getManagers(null, sortField, sortOrder);
  }


  // *** Spinner image load support methods start
  public setUserIdWhenAvatarLoaded(userId: string): void {
    this._userIdsWhenLoadedAvatar.push(userId);
  }

  public isAvatarLoaded(userId: string): boolean {
    let loadedResult: boolean = false;
    this._userIdsWhenLoadedAvatar.forEach(element => {
      if (element == userId) loadedResult = true;
    });
    return loadedResult;
  }
  // *** Spinner image load support methods finish


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
    // this.searchFilterFormModel.setValue({ query: null });
    // this.query = null;
    // this._sortFieldVisited = null;
    // this._sortOrderVisited = null;
  }
  // *** Pagination support methods finish

}



export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}