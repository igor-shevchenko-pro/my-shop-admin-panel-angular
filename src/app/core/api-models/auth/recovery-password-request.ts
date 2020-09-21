import { ContactTypeEnum, FrontClientTypeEnum } from '../base/enums';

export class RecoveryPasswordRequestApiModel{
    public contact: string;
    public contact_type: ContactTypeEnum;
    public front_client: FrontClientTypeEnum;
}