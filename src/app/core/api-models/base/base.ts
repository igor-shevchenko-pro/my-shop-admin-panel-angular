import { IBaseApiModel } from '../../interfaces/base/ibase';
import { EntityActivityStatusEnum } from './enums';

export class BaseApiModel<TKey> implements IBaseApiModel<TKey>{
    public id: TKey;
    public created?: Date;
    public updated?: Date;
    public activity_status?: EntityActivityStatusEnum;
}