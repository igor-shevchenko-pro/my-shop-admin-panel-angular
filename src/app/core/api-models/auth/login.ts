import { ContactTypeEnum } from '../base/enums';

export class LoginApiModel{
    public login: string;
    public password: string;
    public contact_type: ContactTypeEnum;
}