import { BaseApiModel } from './base/base';
import { ImageGalleryGetMinApiModel } from './image-gallery';
import { ProductGetMinApiModel } from './product';

export abstract class CategoryBaseApiModel extends BaseApiModel<number>
{
    public title: string;
    public alias: string;
    public extra_title: string;
    public small_description: string;
    public long_description: string;
    public language_id: number;
    public seo_title: string;
    public seo_keywords: string[];
    public seo_description: string;
    public parent_category_id?: number;
    public parent_category_language_id?: number;
    public image_gallery_id: string;
}

export class CategoryGetFullApiModel extends CategoryBaseApiModel
{
    public parent_category: CategoryGetMinApiModel;
    public image_gallery: ImageGalleryGetMinApiModel;
    public products: Array<ProductGetMinApiModel>; 
}

export class CategoryGetMinApiModel extends CategoryBaseApiModel
{
    public parent_category: CategoryGetMinApiModel;
    public image_gallery: ImageGalleryGetMinApiModel;
}

export class CategoryAddApiModel extends CategoryBaseApiModel
{
}