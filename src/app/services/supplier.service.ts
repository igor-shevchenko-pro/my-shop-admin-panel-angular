import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { supplierEndpoints } from '../core/configurations/api-endpoints';
import { EntityActivityStatusEnum, SupplierSortingEnum, TypeModelResponseEnum } from '../core/api-models/base/enums';
import { SuccessResponseApiModel } from '../core/api-models/base/success-response';
import { SupplierAddApiModel } from '../core/api-models/supplier';
import { PaginationResponseApiModel } from '../core/api-models/base/pagination-response';
import { BaseService } from './base/base.service';
import { IBaseApiModel } from '../core/interfaces/base/ibase';
import { RangeEntitiesRequestApiModel } from '../core/api-models/base/range-entities-request';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends BaseService<SupplierSortingEnum> {

  private readonly _getAll = supplierEndpoints.getAll;
  private readonly _add = supplierEndpoints.add;
  private readonly _getById = supplierEndpoints.getById;
  private readonly _changeActivityStatus = supplierEndpoints.changeActivityStatus;
  private readonly _delete = supplierEndpoints.delete;
  private readonly _deleteRange = supplierEndpoints.deleteRange;
  private readonly _update = supplierEndpoints.update;


  constructor(private _httpClient: HttpClient) {
    super();
  }


  //+
  public getAll(start: number, count: number, modelResponseType: TypeModelResponseEnum, sortField: string,
    sortOrder: number, query: string = null)
    : Observable<PaginationResponseApiModel<IBaseApiModel<string>, SupplierSortingEnum>> {

    // build sortings
    let sortings = this.buildSortings(sortField, sortOrder);
    // build result-model
    let model = this.buildSortedEntitiesRequestModel(start, count, sortings, modelResponseType, query);

    return this._httpClient.post<PaginationResponseApiModel<IBaseApiModel<string>, SupplierSortingEnum>>(this._getAll, model);
  }

  //+
  public getById(id: string, modelResponseType: TypeModelResponseEnum): Observable<IBaseApiModel<string>> {
    let url = `${this._getById}/${id}?modelResponseType=${modelResponseType}`;
    return this._httpClient.get<IBaseApiModel<string>>(url);
  }

  //+
  public add(supplierFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let model = new SupplierAddApiModel();
    model.title = supplierFormGroup.value.Title;
    model.website = supplierFormGroup.value.Website;
    model.email = supplierFormGroup.value.Email;
    model.extra_email = supplierFormGroup.value.ExtraEmail;
    model.phone = supplierFormGroup.value.Phone;
    model.extra_phone = supplierFormGroup.value.ExtraPhone;
    model.manager = supplierFormGroup.value.Manager;
    model.extra_manager = supplierFormGroup.value.ExtraManager;
    model.address = supplierFormGroup.value.Address;
    model.extra_address = supplierFormGroup.value.ExtraAddress;
    model.title = supplierFormGroup.value.Title;
    model.some_info = supplierFormGroup.value.SomeInfo;
    model.activity_status = supplierFormGroup.value.Activity;
    model.language_id = supplierFormGroup.value.LanguageId;

    return this._httpClient.post<SuccessResponseApiModel>(this._add, model);
  }

  //+
  public update(supplierFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let model = new SupplierAddApiModel();
    model.id = supplierFormGroup.value.Id;
    model.title = supplierFormGroup.value.Title;
    model.website = supplierFormGroup.value.Website;
    model.email = supplierFormGroup.value.Email;
    model.extra_email = supplierFormGroup.value.ExtraEmail;
    model.phone = supplierFormGroup.value.Phone;
    model.extra_phone = supplierFormGroup.value.ExtraPhone;
    model.manager = supplierFormGroup.value.Manager;
    model.extra_manager = supplierFormGroup.value.ExtraManager;
    model.address = supplierFormGroup.value.Address;
    model.extra_address = supplierFormGroup.value.ExtraAddress;
    model.description = supplierFormGroup.value.Description;
    model.some_info = supplierFormGroup.value.SomeInfo;
    model.activity_status = supplierFormGroup.value.Activity;
    model.language_id = supplierFormGroup.value.LanguageId;

    let url = `${this._update}/${supplierFormGroup.value.Id}`;

    return this._httpClient.put<SuccessResponseApiModel>(url, model);
  }

  //+
  public changeActivityStatus(id: string, activityStatus: EntityActivityStatusEnum): Observable<SuccessResponseApiModel> {
    let url = `${this._changeActivityStatus}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, activityStatus);
  }

  //+
  public delete(id: string): Observable<SuccessResponseApiModel> {
    let url = `${this._delete}/${id}`;
    return this._httpClient.delete<SuccessResponseApiModel>(url);
  }

  //+
  public deleteRange(suppliers: Array<IBaseApiModel<string>>): Observable<SuccessResponseApiModel> {

    let model = new RangeEntitiesRequestApiModel<string>();
    suppliers.forEach(element => { model.ids.push(element.id) });

    return this._httpClient.post<SuccessResponseApiModel>(this._deleteRange, model);
  }


  //+
  private buildSortings(sortField: string, sortOrder: number): Array<SupplierSortingEnum> {

    let sortings: Array<SupplierSortingEnum> = null;

    if (sortField === 'created' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByCreateAsc];
    }
    else if (sortField === 'created' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByCreateDesc];
    }
    else if (sortField === 'updated' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByUpdateAsc];
    }
    else if (sortField === 'updated' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByUpdateDesc];
    }
    else if (sortField === 'activity_status' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByActivityStatusAsc];
    }
    else if (sortField === 'activity_status' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByActivityStatusDesc];
    }
    else if (sortField === 'title' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByTitleAsc];
    }
    else if (sortField === 'title' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByTitleDesc];
    } 
    else if (sortField === 'description' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByDescriptionAsc];
    }
    else if (sortField === 'description' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByDescriptionDesc];
    }
    else if (sortField === 'email' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByEmailAsc];
    }
    else if (sortField === 'email' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByEmailDesc];
    }
    else if (sortField === 'extra_email' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByExtraEmailAsc];
    }
    else if (sortField === 'extra_email' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByExtraEmailDesc];
    }
    else if (sortField === 'prone' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByPhoneAsc];
    }
    else if (sortField === 'phone' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByPhoneDesc];
    }
    else if (sortField === 'extra_phone' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByExtraPhoneAsc];
    }
    else if (sortField === 'extra_phone' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByExtraPhoneDesc];
    }
    else if (sortField === 'manager' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByManagerAsc];
    }
    else if (sortField === 'manager' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByManagerDesc];
    }
    else if (sortField === 'extra_manager' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByExtraManagerAsc];
    }
    else if (sortField === 'extra_manager' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByExtraManagerDesc];
    }
    else if (sortField === 'address' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByAddressAsc];
    }
    else if (sortField === 'address' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByAddressDesc];
    }
    else if (sortField === 'extra_address' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.ByExtraAddressAsc];
    }
    else if (sortField === 'extra_address' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.ByExtraAddressDesc];
    }
    else if (sortField === 'some_info' && sortOrder === 1) {
      sortings = [SupplierSortingEnum.BySomeInfoAsc];
    }
    else if (sortField === 'some_info' && sortOrder === -1) {
      sortings = [SupplierSortingEnum.BySomeInfoDesc];
    } else {
      sortings = [SupplierSortingEnum.ByCreateDesc];
    }

    return sortings;
  }

}
