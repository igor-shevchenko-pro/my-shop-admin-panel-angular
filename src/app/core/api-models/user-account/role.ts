import { BaseApiModel } from '../base/base';
import { UserGetMinApiModel } from './user';

export abstract class RoleBaseApiModel extends BaseApiModel<string>
{
    public title: string;
}

export class RoleGetFullApiModel extends RoleBaseApiModel
{
    public users: Array<UserGetMinApiModel>;
}

export class RoleGetMinApiModel extends RoleBaseApiModel
{
}

export class RoleAddApiModel extends RoleBaseApiModel
{
}