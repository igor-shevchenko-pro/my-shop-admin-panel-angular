import { TypeModelResponseEnum } from './enums';

export class SortedEntitiesRequestApiModel<TSorting>
{
    public start: number;
    public count: number;
    public sortings: Array<TSorting>;
    public query: string;
    public model_response_type: TypeModelResponseEnum;

    constructor() {
        this.sortings = new Array<TSorting>();
    }
}

export class SortedEntitiesByUserRequestApiModel<TSorting> extends SortedEntitiesRequestApiModel<TSorting>
{
    public user_id: string;
}