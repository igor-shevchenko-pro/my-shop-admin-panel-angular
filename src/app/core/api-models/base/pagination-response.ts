export class PaginationResponseApiModel<ApiModel, TSorting>
{
    public start: number;
    public count: number;
    public total: number;
    public sortings: Array<TSorting>;
    public models: Array<ApiModel>;
}