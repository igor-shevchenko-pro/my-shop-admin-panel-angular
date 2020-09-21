import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { brandEndpoints } from '../core/configurations/api-endpoints';
import { BrandSortingEnum, EntityActivityStatusEnum } from '../core/api-models/base/enums';
import { PaginationResponseApiModel } from '../core/api-models/base/pagination-response';
import { BrandAddApiModel, BrandGetMinApiModel } from '../core/api-models/brand';
import { SuccessResponseApiModel } from '../core/api-models/base/success-response';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private readonly _getAll = brandEndpoints.getAll;
  private readonly _add = brandEndpoints.add;
  private readonly _getById = brandEndpoints.getById;
  private readonly _changeActivityStatus = brandEndpoints.changeActivityStatus;
  private readonly _delete = brandEndpoints.delete;
  private readonly _update = brandEndpoints.update;


  constructor(private _httpClient: HttpClient) { }

  
  public getAll(start: number, count: number, sort: BrandSortingEnum)
  : Observable<PaginationResponseApiModel<BrandGetMinApiModel, BrandSortingEnum>> {
    let url = `${this._getAll}?start=${start}&count=${count}&sort=${sort}`;
    return this._httpClient.get<PaginationResponseApiModel<BrandGetMinApiModel, BrandSortingEnum>>(url);
  }

  public getById(id: string): Observable<BrandGetMinApiModel> {
    let url = `${this._getById}/${id}`;
    return this._httpClient.get<BrandGetMinApiModel>(url);
  }

  public add(brandFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let model = new BrandAddApiModel();
    model.title = brandFormGroup.value.Title;
    model.alias = brandFormGroup.value.Alias;
    if(brandFormGroup.value.Status == true) model.activity_status = EntityActivityStatusEnum.Inactive;
    if(brandFormGroup.value.Status == false) model.activity_status = EntityActivityStatusEnum.Inactive-2;
    model.description = brandFormGroup.value.Description;
    model.file_id = brandFormGroup.value.FileId;
    model.seo_title = brandFormGroup.value.SeoTitle;
    model.seo_description = brandFormGroup.value.SeoDescription;
    if(brandFormGroup.value.SeoKeywords != null){
      model.seo_keywords = brandFormGroup.value.SeoKeywords.split(";");
    }

    return this._httpClient.post<SuccessResponseApiModel>(this._add, model);
  }

  public update(id: string, brandFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let model = new BrandAddApiModel();
    model.title = brandFormGroup.value.Title;
    model.alias = brandFormGroup.value.Alias;
    if(brandFormGroup.value.Status == true) model.activity_status = EntityActivityStatusEnum.Inactive;
    if(brandFormGroup.value.Status == false) model.activity_status = EntityActivityStatusEnum.Inactive-2;
    model.description = brandFormGroup.value.Description;
    model.file_id = brandFormGroup.value.FileId;
    model.seo_title = brandFormGroup.value.SeoTitle;
    model.seo_description = brandFormGroup.value.SeoDescription;
    if(brandFormGroup.value.SeoKeywords != null && brandFormGroup.value.SeoKeywords != ""){
      model.seo_keywords = brandFormGroup.value.SeoKeywords.split(";");
    }

    let url = `${this._update}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, model);
  }

  public changeStatus(id: number, status: EntityActivityStatusEnum): Observable<SuccessResponseApiModel>{
    let url = `${this._changeActivityStatus}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, status);
  }

  public delete(id: string): Observable<SuccessResponseApiModel>{
    return this._httpClient.delete<SuccessResponseApiModel>(this._delete + '/' + id);
  }

}
