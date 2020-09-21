import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryTreeNodeModel } from 'src/app/core/models/category-tree-node';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { CategorySortingEnum, EntityActivityStatusEnum, FileEntityTypeEnum } from 'src/app/core/api-models/base/enums';
import { CategoryGetMinApiModel } from 'src/app/core/api-models/category';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css'],
  providers: [DatePipe],
})
export class ListCategoriesComponent implements OnInit {

  public files: TreeNode[];
  public cols: any[];
  public categoriesTotal: number = 0;
  public selectedNodes: TreeNode[] = [];
  private _start: number = 0;
  private _count: number = 200;
  private _sortings: CategorySortingEnum = CategorySortingEnum.ByCreateAsc;

  public formSearchFilter = new FormGroup({
    first: new FormControl(),
  });


  constructor(private _categoryService: CategoryService,
              private _router: Router,
              private _notifyService: NotificationService,
              public datepipe: DatePipe) { }

  ngOnInit() {
    this.getCategories();

    // default column titles
    this.cols = [
      { field: 'expand-icon', header: '', width: '5%' },
      { field: 'image', header: 'Фото', width: '10%' },
      { field: 'name', header: 'Название', width: '40%' },
      { field: 'created', header: 'Дата создания', width: '19%' },
      { field: 'status', header: 'Статус', width: '10%' },
      { field: 'options', header: 'Опции', width: '16%' },
      // { field: 'children', header: 'Подкатегорий', width: '15%' },
      { field: 'level', header: '' },
      { field: 'id', header: '' },
    ];
  }


  public getCategoryStatus(status: number): boolean {
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
    // console.log(id);
    // console.log($event);

    let status: EntityActivityStatusEnum;
    if ($event == true) status = EntityActivityStatusEnum.Inactive;
    if ($event == false) status = EntityActivityStatusEnum.Inactive-2;

    this._categoryService.changeStatus(id, status).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          // this._notifyService.showSuccess("Статус изменен успешно", "");
          this.getCategories();
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._notifyService.showError("Категория не найдена", "Ошибка изменения статуса");
              break;

            default:
              this._notifyService.showError("Ошибка изменения статуса", "");
              break;
          }
        });
      }
    );
  }

  public redirectToCategoryInfo(id: number): void {
    const url = '/home/category/' + id;
    this._router.navigateByUrl(url);
  }

  public searchInputClear(): void {
    this.formSearchFilter.setValue({ first: '' });
  }


  private getCategories(): void {
    this._categoryService.getAll(this._start, this._count, this._sortings).subscribe(
      (res: PaginationResponseApiModel<CategoryGetMinApiModel, CategorySortingEnum>) => {
        // console.log(res);
        if (res.models.length > 0) {
          // build categories tree whith nested models
          this.files = this.BuildcategoriesTree(res.models);
          this.categoriesTotal = res.models.length;
        }
      },
      errors => {
        // console.log(errors);
      }
    );
  }

  // build categories tree whith nested models
  private BuildcategoriesTree(categoriesApi: Array<CategoryGetMinApiModel>): TreeNode[] {
    let categoriesResult: TreeNode[] = [];

    // step_1: get parrent categories
    categoriesApi.forEach(element => {
      if (element.parent_category_id == null) {
        let categoryParent: CategoryTreeNodeModel = new CategoryTreeNodeModel();

        // step_2: get first-children categories
        let firstChildren = this.getNestedCategories(element.id, categoriesApi, 1);
        if (firstChildren.length > 0) {
          categoryParent.children = firstChildren;
        }

        let tempCategory = {
          id: element.id,
          created: this.datepipe.transform(element.created, 'dd-MM-yyyy hh:mm:ss'),
          image: element.image_gallery?.gallery_files?.find(x => x.type == FileEntityTypeEnum.IconImage)?.url,
          name: element.title,
          // children: firstChildren.length,
          level: 0,
          status: element.activity_status,
        };

        categoryParent.data = tempCategory;
        categoriesResult.push(categoryParent);
      }
    });

    return categoriesResult;
  }

  // get nested categories
  private getNestedCategories(parentId: number, categories: Array<CategoryGetMinApiModel>, level: number): TreeNode[] {
    let categoriesChildren: TreeNode[] = [];
    categories.forEach(element => {
      if (element.parent_category_id == parentId) {
        let category: CategoryTreeNodeModel = new CategoryTreeNodeModel();

        // step_3: get other-children categories
        let otherChildren = this.getNestedCategories(element.id, categories, 2);
        if (otherChildren.length > 0) {
          category.children = otherChildren;
        }

        let tempCategory = {
          id: element.id,
          created: this.datepipe.transform(element.created, 'dd-MM-yyyy hh:mm:ss'),
          image: element.image_gallery?.gallery_files?.find(x => x.type == FileEntityTypeEnum.IconImage)?.url,
          name: element.title,
          // children: otherChildren.length,
          level: level,
          status: element.activity_status,
        };

        category.data = tempCategory;
        categoriesChildren.push(category);
      }
    });
    return categoriesChildren;
  }

}
