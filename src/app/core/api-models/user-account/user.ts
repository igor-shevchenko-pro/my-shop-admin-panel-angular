import { BaseApiModel } from '../base/base';
import { RoleAddApiModel, RoleGetMinApiModel } from './role';
import { UserProfileAddApiModel, UserProfileGetFullApiModel } from './user-profile';

export abstract class UserBaseApiModel extends BaseApiModel<string>
{
    public user_name: string;
    public email: string;
    public phone: string;
    public is_email_confirmed: boolean;
    public is_phone_confirmed: boolean;
    public user_profile_id: string;
    // Support property
    public roles_for_view: string;
}

export class UserGetFullApiModel extends UserBaseApiModel
{
    public roles: Array<RoleGetMinApiModel>;
    public user_profile: UserProfileGetFullApiModel;
}

export class UserGetMinApiModel extends UserBaseApiModel
{
}

export class UserAddApiModel extends UserBaseApiModel
{
    public password: string
    public roles: Array<RoleAddApiModel>;
    public user_profile: UserProfileAddApiModel;
}