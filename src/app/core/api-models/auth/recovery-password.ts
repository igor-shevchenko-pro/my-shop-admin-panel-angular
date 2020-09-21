import { ContactTypeEnum } from '../base/enums';

export class RecoveryPasswordApiModel {
    public contact: string;
    public code: string;
    public new_password: string;
    public contact_type: ContactTypeEnum;
}