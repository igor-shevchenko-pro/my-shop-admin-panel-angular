import { BaseApiModel } from '../base/base';
import { FileGetMinApiModel } from '../file';

export abstract class UserProfileBaseApiModel extends BaseApiModel<string>
{
    public first_name: string;
    public second_name: string;
    public date_of_birth: string;
    public address: string;
    public file_id: string;
    public language_id: number;
    public gender_id: number;
}

export class UserProfileGetFullApiModel extends UserProfileBaseApiModel
{
    public file: FileGetMinApiModel;
}

export class UserProfileGetMinApiModel extends UserProfileBaseApiModel
{
}

export class UserProfileAddApiModel extends UserProfileBaseApiModel
{
}