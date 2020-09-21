import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { fileEndpoints } from '../core/configurations/api-endpoints';
import { SuccessResponseApiModel } from '../core/api-models/base/success-response';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly _add = fileEndpoints.add;
  private readonly _delete = fileEndpoints.delete;
  private readonly _deleteRange = fileEndpoints.deleteRange;

  constructor(private _httpClient: HttpClient) { }

  public add(formData: FormData): Observable<any> {
    return this._httpClient.post<any>(this._add, formData,
      {
        reportProgress: true,
        observe: "events"
      });
  }

  public delete(id: string): Observable<SuccessResponseApiModel>{
    let url = `${this._delete}/${id}`;
    return this._httpClient.delete<SuccessResponseApiModel>(url);
  }

  public deleteRange(ids: string[]): Observable<SuccessResponseApiModel>{
    return this._httpClient.post<SuccessResponseApiModel>(this._deleteRange, ids);
  }

}