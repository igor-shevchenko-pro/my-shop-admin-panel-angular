import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { FileService } from 'src/app/services/file.service';
import { EntityActivityStatusEnum, TypeModelResponseEnum, UserSortingEnum } from 'src/app/core/api-models/base/enums';
import { UserGetFullApiModel } from 'src/app/core/api-models/user-account/user';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';
import { MenuItem, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/services/base/bradcrumb.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-managers',
  templateUrl: './list-managers.component.html',
  styleUrls: ['./list-managers.component.css']
})
export class ListManagersComponent implements OnInit, OnDestroy {

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem;
  public blockedDocument: boolean = false;
  products: Product[];
  sortOrder: number;
  sortField: string;
  sortOptions: SelectItem[];
  sortKey: string;

  public managers: Array<UserGetFullApiModel>;
  public userRoles: string;
  private _userId: string;
  private _fileId: string;
  private _start: number = 0;
  private _count: number = 100;
  private _sortings: Array<UserSortingEnum> = [UserSortingEnum.ByCreateDesc];


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
              private _notifyService: NotificationService,
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
    this.sortOptions = [
      {label: 'Price High to Low', value: '!price'},
      {label: 'Price Low to High', value: 'price'}
  ];
  }

  ngOnDestroy(): void {
    this._breadcrumbService.breadcrumbItems = [];
  }


  public getManagers(): void {
    let tempRoles: Array<string> = new Array<string>();
    this._userService.getManagers(this._start, this._count, this._sortings, TypeModelResponseEnum.GetFullApiModel).subscribe(
      (res: PaginationResponseApiModel<UserGetFullApiModel, UserSortingEnum>) => {
        // console.log(res);
        if (res.models.length > 0) {
          res.models.forEach(element => {
            element.roles.forEach(item => {
              tempRoles.push(item.title);
            });
            element.roles_for_view = tempRoles.join(' / ');
            tempRoles = new Array<string>();
          });
        }
        this.managers = res.models;
      },
      errors => {
        // console.log(errors);
      }
    );
  }

  public deleteManager(): void {
    this._modalService.dismissAll();
    //delete USER
    this._userService.delete(this._userId).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.getManagers();
          this._notifyService.showSuccess("Менеджер удален успешно", "");
          this._userId = null;
          //delete USER'S FILE
          this._fileService.delete(this._fileId).subscribe(
            (res: SuccessResponseApiModel) => {
              this._fileId = null;
            },
            errors => {
              // console.log(errors);
            }
          );
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._notifyService.showError("Менеджер не найден", "Ошибка удаления менеджера");
              break;

            default:
              this._notifyService.showError("Ошибка удаления менеджера", "");
              break;
          }
        });
      }
    );
  }

  public openModal(content, userId = null, fileId = null) {
    this._userId = userId;
    this._fileId = fileId;
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
              this._notifyService.showError("Менеджер не найден", "Ошибка изменения статуса");
              break;

            default:
              this._notifyService.showError("Ошибка изменения статуса", "");
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


  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
}

}



export interface Product {
  id?:string;
  code?:string;
  name?:string;
  description?:string;
  price?:number;
  quantity?:number;
  inventoryStatus?:string;
  category?:string;
  image?:string;
  rating?:number;
}