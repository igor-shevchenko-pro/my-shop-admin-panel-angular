import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { userEndpoints } from '../core/configurations/api-endpoints';
import { UserAddApiModel, UserGetFullApiModel } from '../core/api-models/user-account/user';
import { RoleAddApiModel } from '../core/api-models/user-account/role';
import { UserProfileAddApiModel } from '../core/api-models/user-account/user-profile';
import { EntityActivityStatusEnum, TypeModelResponseEnum, UserSortingEnum } from '../core/api-models/base/enums';
import { SuccessResponseApiModel } from '../core/api-models/base/success-response';
import { PaginationResponseApiModel } from '../core/api-models/base/pagination-response';
import { IBaseApiModel } from '../core/interfaces/base/ibase';
import { BaseService } from './base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserSortingEnum> {

  private readonly _add = userEndpoints.add;
  private readonly _update = userEndpoints.update;
  private readonly _getCurrent = userEndpoints.getCurrent;
  private readonly _getById = userEndpoints.getById;
  private readonly _getManagers = userEndpoints.getManagers;
  private readonly _delete = userEndpoints.delete;
  private readonly _changeActivityStatus = userEndpoints.changeActivityStatus;
  private readonly _setDefaultPhoto = userEndpoints.setDefaultPhoto;


  constructor(private _httpClient: HttpClient) {
    super();
  }


  public getCurrentUser(modelResponseType: TypeModelResponseEnum): Observable<IBaseApiModel<string>> {
    let url = `${this._getCurrent}?modelresponsetype=${modelResponseType}`;
    return this._httpClient.get<IBaseApiModel<string>>(url);
  }

  public getManagers(start: number, count: number, modelResponseType: TypeModelResponseEnum,
    sortField: string, sortOrder: number, query: string = null): Observable<PaginationResponseApiModel<UserGetFullApiModel, UserSortingEnum>> {

    // build sortings
    let sortings = this.buildSortings(sortField, sortOrder);

    let model = this.buildSortedEntitiesRequestModel(start, count, sortings, modelResponseType, query);
    return this._httpClient.post<PaginationResponseApiModel<IBaseApiModel<string>, UserSortingEnum>>(this._getManagers, model);
  }


  public getById(id: string, modelResponseType: TypeModelResponseEnum): Observable<IBaseApiModel<string>> {
    let url = `${this._getById}/${id}?modelresponsetype=${modelResponseType}`;
    return this._httpClient.get<IBaseApiModel<string>>(url);
  }

  public add(userFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let userModel = new UserAddApiModel();
    let userProfileModel = new UserProfileAddApiModel();
    let userRoles = Array<RoleAddApiModel>();

    userProfileModel.address = userFormGroup.value.Address;
    userProfileModel.date_of_birth = userFormGroup.value.DateOfBirth;
    userProfileModel.file_id = userFormGroup.value.FileEntityId;
    userProfileModel.first_name = userFormGroup.value.FirstName;
    userProfileModel.second_name = userFormGroup.value.SecondName;
    userProfileModel.gender_id = userFormGroup.value.GenderId ? userFormGroup.value.GenderId : 0;
    userProfileModel.language_id = userFormGroup.value.LanguageId ? userFormGroup.value.LanguageId : 0;

    if (userFormGroup.value.Roles != null && userFormGroup.value.Roles != "") {
      userFormGroup.value.Roles.forEach(element => {
        userRoles.push(element);
      });
    }

    userModel.user_name = userFormGroup.value.UserName;
    userModel.email = userFormGroup.value.Email;
    userModel.phone = userFormGroup.value.Phone;
    userModel.password = userFormGroup.value.Password;
    userModel.roles = userRoles;
    userModel.user_profile = userProfileModel;
    if (userFormGroup.value.Status == true) userModel.activity_status = EntityActivityStatusEnum.Inactive;
    if (userFormGroup.value.Status == false) userModel.activity_status = EntityActivityStatusEnum.Inactive - 2;

    return this._httpClient.post<SuccessResponseApiModel>(this._add, userModel);
  }

  public delete(id: string): Observable<SuccessResponseApiModel> {
    return this._httpClient.delete<SuccessResponseApiModel>(this._delete + '/' + id);
  }

  public changeStatus(id: number, status: EntityActivityStatusEnum): Observable<SuccessResponseApiModel> {
    let url = `${this._changeActivityStatus}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, status);
  }

  public update(id: string, userFormGroup: FormGroup): Observable<SuccessResponseApiModel> {

    let userModel = new UserAddApiModel();
    let userProfileModel = new UserProfileAddApiModel();
    let userRoles = Array<RoleAddApiModel>();

    userProfileModel.address = userFormGroup.value.Address;
    userProfileModel.date_of_birth = userFormGroup.value.DateOfBirth;
    userProfileModel.file_id = userFormGroup.value.FileEntityId;
    userProfileModel.first_name = userFormGroup.value.FirstName;
    userProfileModel.second_name = userFormGroup.value.SecondName;
    userProfileModel.gender_id = userFormGroup.value.GenderId ? userFormGroup.value.GenderId : 0;
    userProfileModel.language_id = userFormGroup.value.LanguageId ? userFormGroup.value.LanguageId : 0;

    if (userFormGroup.value.Roles != null && userFormGroup.value.Roles != "") {
      userFormGroup.value.Roles.forEach(element => {
        userRoles.push(element);
      });
    }

    userModel.id = id;
    userModel.user_name = userFormGroup.value.UserName;
    userModel.email = userFormGroup.value.Email;
    userModel.phone = userFormGroup.value.Phone;
    userModel.password = userFormGroup.value.Password;
    userModel.roles = userRoles;
    userModel.user_profile = userProfileModel;
    if (userFormGroup.value.Status == true) userModel.activity_status = EntityActivityStatusEnum.Inactive;
    if (userFormGroup.value.Status == false) userModel.activity_status = EntityActivityStatusEnum.Inactive - 2;

    let url = `${this._update}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, userModel);
  }

  public setDefaultPhoto(id: string): Observable<SuccessResponseApiModel> {
    let url = `${this._setDefaultPhoto}/${id}`;
    return this._httpClient.put<SuccessResponseApiModel>(url, id);
  }


  //+
  private buildSortings(sortField: string, sortOrder: number): Array<UserSortingEnum> {

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
