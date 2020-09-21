import { BaseApiModel } from './base/base';
import { FileGetMinApiModel } from './file';

export abstract class ImageGalleryBaseApiModel extends BaseApiModel<string>
{
    public gallery_files: Array<FileGetMinApiModel>;
}

export class ImageGalleryGetFullApiModel extends ImageGalleryBaseApiModel
{
}

export class ImageGalleryGetMinApiModel extends ImageGalleryBaseApiModel
{
}

export class ImageGalleryAddApiModel extends ImageGalleryBaseApiModel
{
}