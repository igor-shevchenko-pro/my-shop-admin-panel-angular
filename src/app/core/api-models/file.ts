import { FileEntityTypeEnum } from './base/enums';
import { BaseApiModel } from './base/base';

export abstract class FileBaseApiModel extends BaseApiModel<string> {
    public name: string;
    public extension: string;
    public type: FileEntityTypeEnum;
    public image_gallery_id: string;
    public url: string;
}

export class FileGetFullApiModel extends FileBaseApiModel
{
    public bytes: Array<any>;
}

export class FileGetMinApiModel extends FileBaseApiModel
{
}

export class FileAddApiModel extends FileBaseApiModel
{
    public bytes: Array<any>;
}