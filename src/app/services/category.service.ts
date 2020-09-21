import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { categoryEndpoints } from '../core/configurations/api-endpoints';
import { CategorySortingEnum, EntityActivityStatusEnum } from '../core/api-models/base/enums';
import { PaginationResponseApiModel } from '../core/api-models/base/pagination-response';
import { CategoryAddApiModel, CategoryGetMinApiModel } from '../core/api-models/category';
import { SuccessResponseApiModel } from '../core/api-models/base/success-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly _getById = categoryEndpoints.getById;
  private readonly _getAll = categoryEndpoints.getAll;
  private readonly _add = categoryEndpoints.add;
  private readonly _delete = categoryEndpoints.delete;
  private readonly _update = categoryEndpoints.update;
  private readonly _changeActivityStatus = categoryEndpoints.changeActivityStatus;


  constructor(private _httpClient: HttpClient) { }


  public getAll(start: number, count: number, sort: CategorySortingEnum)
  : Observable<PaginationResponseApiModel<CategoryGetMinApiModel, CategorySortingEnum>> {
    let url = `${this._getAll}?start=${start}&count=${count}&sort=${sort}`;
    return this._httpClient.get<PaginationResponseApiModel<CategoryGetMinApiModel, CategorySortingEnum>>(url);
  }

  public getById(id: string): Observable<CategoryGetMinApiModel> {
    let url = `${this._getById}/${id}`;
    return this._httpClient.get<CategoryGetMinApiModel>(url);
  }

  public add(categoryFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let model = new CategoryAddApiModel();
    model.title = categoryFormGroup.value.Title;
    model.alias = categoryFormGroup.value.Alias;
    if(categoryFormGroup.value.Status == true) model.activity_status = EntityActivityStatusEnum.Inactive;
    if(categoryFormGroup.value.Status == false) model.activity_status = EntityActivityStatusEnum.Inactive-2;
    model.extra_title = categoryFormGroup.value.ExtraTitle;
    if(categoryFormGroup.value.ParentCategoryId != null && categoryFormGroup.value.ParentCategoryId.length > 0){
      model.parent_category_id = categoryFormGroup.value.ParentCategoryId[0].id;
    }
    model.parent_category_language_id = categoryFormGroup.value.ParentCategoryLanguageId;
    model.seo_title = categoryFormGroup.value.SeoTitle;
    if(categoryFormGroup.value.SeoKeywords != null){
      model.seo_keywords = categoryFormGroup.value.SeoKeywords.split(";");
    }
    model.seo_description = categoryFormGroup.value.SeoDescription;
    model.small_description = categoryFormGroup.value.SmallDescription;
    model.long_description = categoryFormGroup.value.LongDescription;
    model.language_id = categoryFormGroup.value.LanguageId;
    model.image_gallery_id = categoryFormGroup.value.ImageGalleryId;

    return this._httpClient.post<SuccessResponseApiModel>(this._add, model);
  }

  public delete(id: string): Observable<SuccessResponseApiModel>{
    return this._httpClient.delete<SuccessResponseApiModel>(this._delete + '/' + id);
  }

  public update(id: string, categoryFormGroup: FormGroup): Observable<SuccessResponseApiModel>{

    let model = new CategoryAddApiModel();
    model.title = categoryFormGroup.value.Title;
    model.alias = categoryFormGroup.value.Alias;
    if(categoryFormGroup.value.Status == true) model.activity_status = EntityActivityStatusEnum.Inactive;
    if(categoryFormGroup.value.Status == false) model.activity_status = EntityActivityStatusEnum.Inactive-2;
    model.extra_title = categoryFormGroup.value.ExtraTitle;
    if(categoryFormGroup.value.ParentCategoryId != null && categoryFormGroup.value.ParentCategoryId.length > 0){
      model.parent_category_id = categoryFormGroup.value.ParentCategoryId[0].id;
    }
    model.parent_category_language_id = categoryFormGroup.value.ParentCategoryLanguageId;
    model.seo_title = categoryFormGroup.value.SeoTitle;
    if(categoryFormGroup.value.SeoKeywords != null && categoryFormGroup.value.SeoKeywords != ""){
      model.seo_keywords = categoryFormGroup.value.SeoKeywords.split(";");
    }
    model.seo_description = categoryFormGroup.value.SeoDescription;
    model.small_description = categoryFormGroup.value.SmallDescription;
    model.long_description = categoryFormGroup.value.LongDescription;
    model.language_id = categoryFormGroup.value.LanguageId;
    model.image_gallery_id = categoryFormGroup.value.ImageGalleryId;

    let url = `${this._update}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, model);
  }

  public changeStatus(id: number, status: EntityActivityStatusEnum): Observable<SuccessResponseApiModel>{
    let url = `${this._changeActivityStatus}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, status);
  }

}
