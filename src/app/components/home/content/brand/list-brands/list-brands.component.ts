import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/services/brand.service';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { BrandGetMinApiModel } from 'src/app/core/api-models/brand';
import { BrandSortingEnum, EntityActivityStatusEnum } from 'src/app/core/api-models/base/enums';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';

@Component({
  selector: 'app-list-brands',
  templateUrl: './list-brands.component.html',
  styleUrls: ['./list-brands.component.css']
})
export class ListBrandsComponent implements OnInit {

  public brandsTotal: number = 0;
  public brands: BrandGetMinApiModel[] = [];
  private _start: number = 0;
  private _count: number = 200;
  private _sortings: BrandSortingEnum = BrandSortingEnum.ByCreateAsc;


  constructor(private _brandService: BrandService,
              private _notifyService: NotificationService) { }

  ngOnInit(): void {
    this.getAll();
  }


  public onChangeStatus(id: number, $event): void {
    // console.log($event);
    let status: EntityActivityStatusEnum;
    if($event == true) status = EntityActivityStatusEnum.Inactive;
    if($event == false) status = EntityActivityStatusEnum.Inactive-2;

    this._brandService.changeStatus(id, status).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          // this._notifyService.showSuccess("Статус изменен успешно", "");
          this.getAll();
        }
      },
      errors => {
        console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._notifyService.showError("Бренд не найден", "Ошибка изменения статуса");
              break;

            default:
              this._notifyService.showError("Ошибка изменения статуса", "");
              break;
          }
        });
      }
    );
  }

  public getBrandStatus(status: number): boolean {
    switch (status) {
      case 0:
        return true;
      case 1:
        return false;

      default:
        return true;
    }
  }


  private getAll(): void {
    this._brandService.getAll(this._start, this._count, this._sortings).subscribe(
      (res: PaginationResponseApiModel<BrandGetMinApiModel, BrandSortingEnum>) => {
        // console.log(res);
        if (res.models.length > 0) {
          // res.models.forEach(function (item, index) {
          //   item.index = index + 1;
          //   index++;
          // });
          this.brands = res.models;
          this.brandsTotal = res.models.length;
        }
      },
      errors => {
        // console.log(errors);
      }
    );
  }

}
