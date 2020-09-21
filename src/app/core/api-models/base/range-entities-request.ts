import { EntityActivityStatusEnum } from './enums';

export class RangeEntitiesRequestApiModel<TKey>
{
    public ids: Array<TKey>;

    constructor() {
        this.ids = new Array<TKey>();
    }
}