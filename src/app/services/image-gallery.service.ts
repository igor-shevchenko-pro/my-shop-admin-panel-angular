import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { imageGalleryEndpoints } from '../core/configurations/api-endpoints';
import { ImageGalleryAddApiModel, ImageGalleryGetMinApiModel } from '../core/api-models/image-gallery';
import { SuccessResponseApiModel } from '../core/api-models/base/success-response';

@Injectable({
  providedIn: 'root'
})
export class ImageGalleryService {
  private readonly _add = imageGalleryEndpoints.add;
  private readonly _getById = imageGalleryEndpoints.getById;
  private readonly _delete = imageGalleryEndpoints.delete;


  constructor(private _httpClient: HttpClient) { }


  public add(): Observable<SuccessResponseApiModel> {

    let model: ImageGalleryAddApiModel = new ImageGalleryAddApiModel();
    model.gallery_files = null;

    return this._httpClient.post<SuccessResponseApiModel>(this._add, model);
  }

  public getById(id: string): Observable<ImageGalleryGetMinApiModel> {
    let url = `${this._getById}/${id}`;
    return this._httpClient.get<ImageGalleryGetMinApiModel>(url);
  }

  public delete(id: string): Observable<SuccessResponseApiModel> {
    return this._httpClient.delete<SuccessResponseApiModel>(this._delete + '/' + id);
  }
}
