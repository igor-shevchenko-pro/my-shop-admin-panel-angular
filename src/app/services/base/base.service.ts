import { Injectable } from '@angular/core';
import { TypeModelResponseEnum } from 'src/app/core/api-models/base/enums';
import { SortedEntitiesRequestApiModel } from 'src/app/core/api-models/base/sorted-entities-request';

@Injectable({
  providedIn: 'root'
})
export class BaseService<TSorting> {

  constructor() { }

  protected buildSortedEntitiesRequestModel(start: number, count: number, sortings: TSorting[], 
    modelResponseType: TypeModelResponseEnum, query: string = null): SortedEntitiesRequestApiModel<TSorting> {

    let model = new SortedEntitiesRequestApiModel<TSorting>();
    model.start = start;
    model.count = count;
    model.sortings = sortings;
    model.model_response_type = modelResponseType;
    model.query = query;

    return model;
  }

}
