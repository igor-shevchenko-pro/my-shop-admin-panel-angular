import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { BaseService } from './base/base.service';
import { roleEndpoints } from '../core/configurations/api-endpoints';
import { EntityActivityStatusEnum, RoleSortingEnum, TypeModelResponseEnum } from '../core/api-models/base/enums';
import { RoleAddApiModel, RoleGetFullApiModel } from '../core/api-models/user-account/role';
import { SuccessResponseApiModel } from '../core/api-models/base/success-response';
import { PaginationResponseApiModel } from '../core/api-models/base/pagination-response';
import { IBaseApiModel } from '../core/interfaces/base/ibase';
import { RangeEntitiesRequestApiModel } from '../core/api-models/base/range-entities-request';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService<RoleSortingEnum> {

  private readonly _getAll = roleEndpoints.getAll;
  private readonly _getAllWithNestedManagers = roleEndpoints.getAllWithNestedManagers;
  private readonly _add = roleEndpoints.add;
  private readonly _delete = roleEndpoints.delete;
  private readonly _deleteRange = roleEndpoints.deleteRange;
  private readonly _update = roleEndpoints.update;
  private readonly _changeActivityStatus = roleEndpoints.changeActivityStatus;


  constructor(private _httpClient: HttpClient) {
    super();
  }


  //+
  public getAllWithNestedManagers(start: number, count: number, modelResponseType: TypeModelResponseEnum,
    sortField: string, sortOrder: number, query: string = null): Observable<PaginationResponseApiModel<RoleGetFullApiModel, RoleSortingEnum>> {

    // build sortings
    let sortings = this.buildSortings(sortField, sortOrder);
    // build result-model
    let model = this.buildSortedEntitiesRequestModel(start, count, sortings, modelResponseType, query);

    return this._httpClient.post<PaginationResponseApiModel<RoleGetFullApiModel, RoleSortingEnum>>(this._getAllWithNestedManagers, model);
  }

  public getAll(start: number, count: number, sortings: RoleSortingEnum[], modelResponseType: TypeModelResponseEnum,
    query: string = null)
    : Observable<PaginationResponseApiModel<IBaseApiModel<string>, RoleSortingEnum>> {
    let model = this.buildSortedEntitiesRequestModel(start, count, sortings, modelResponseType, query);
    return this._httpClient.post<PaginationResponseApiModel<IBaseApiModel<string>, RoleSortingEnum>>(this._getAll, model);
  }

  //+
  public add(roleFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let model = new RoleAddApiModel();
    model.title = roleFormGroup.value.Title;
    model.activity_status = roleFormGroup.value.Activity;

    return this._httpClient.post<SuccessResponseApiModel>(this._add, model);
  }

  //+
  public delete(id: string): Observable<SuccessResponseApiModel> {
    let url = `${this._delete}/${id}`;
    return this._httpClient.delete<SuccessResponseApiModel>(url);
  }

  //+
  public deleteRange(roles: Array<IBaseApiModel<string>>): Observable<SuccessResponseApiModel> {

    let model = new RangeEntitiesRequestApiModel<string>();
    roles.forEach(element => { model.ids.push(element.id) });

    return this._httpClient.post<SuccessResponseApiModel>(this._deleteRange, model);
  }

  //+
  public update(roleFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let model = new RoleAddApiModel();
    model.id = roleFormGroup.value.Id;
    model.title = roleFormGroup.value.Title;
    model.activity_status = roleFormGroup.value.Activity;

    let url = `${this._update}/${roleFormGroup.value.Id}`;

    return this._httpClient.put<SuccessResponseApiModel>(url, model);
  }

  //+
  public changeActivityStatus(id: string, activityStatus: EntityActivityStatusEnum): Observable<SuccessResponseApiModel> {
    let url = `${this._changeActivityStatus}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, activityStatus);
  }


  //+
  private buildSortings(sortField: string, sortOrder: number): Array<RoleSortingEnum> {

    let sortings: Array<RoleSortingEnum> = null;

    if (sortField === 'created' && sortOrder === 1) {
      sortings = [RoleSortingEnum.ByCreateAsc];
    }
    else if (sortField === 'created' && sortOrder === -1) {
      sortings = [RoleSortingEnum.ByCreateDesc];
    }
    else if (sortField === 'updated' && sortOrder === 1) {
      sortings = [RoleSortingEnum.ByUpdateAsc];
    }
    else if (sortField === 'updated' && sortOrder === -1) {
      sortings = [RoleSortingEnum.ByUpdateDesc];
    }
    else if (sortField === 'activity_status' && sortOrder === -1) {
      sortings = [RoleSortingEnum.ByActivityStatusAsc];
    }
    else if (sortField === 'activity_status' && sortOrder === 1) {
      sortings = [RoleSortingEnum.ByActivityStatusDesc];
    }
    else if (sortField === 'title' && sortOrder === 1) {
      sortings = [RoleSortingEnum.ByTitleAsc];
    }
    else if (sortField === 'title' && sortOrder === -1) {
      sortings = [RoleSortingEnum.ByTitleDesc];
    } else {
      sortings = [RoleSortingEnum.ByCreateDesc];
    }

    return sortings;
  }

}
