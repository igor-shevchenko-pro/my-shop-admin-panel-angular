import { BaseApiModel } from './base/base';
import { FileGetMinApiModel } from './file';
import { ProductGetMinApiModel } from './product';

export abstract class BrandBaseApiModel extends BaseApiModel<number>
{
    public title: string;
    public alias: string;
    public description: string;
    public seo_title: string;
    public seo_keywords: string[];
    public seo_description: string;
    public file_id: string;
}

export class BrandGetFullApiModel extends BrandBaseApiModel
{
    public file: FileGetMinApiModel;
    public products: Array<ProductGetMinApiModel>;
}

export class BrandGetMinApiModel extends BrandBaseApiModel
{
    public file: FileGetMinApiModel;
}

export class BrandAddApiModel extends BrandBaseApiModel
{
}