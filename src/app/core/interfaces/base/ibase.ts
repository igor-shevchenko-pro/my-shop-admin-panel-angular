import { EntityActivityStatusEnum } from '../../api-models/base/enums';

export interface IBaseApiModel<TKey>
{
    id: TKey;
    created?: Date;
    updated?: Date;
    activity_status?: EntityActivityStatusEnum;
}