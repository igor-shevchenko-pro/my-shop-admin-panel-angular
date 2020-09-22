import { BaseApiModel } from './base/base';
import { ProductGetMinApiModel } from './product';

export abstract class SupplierBaseApiModel extends BaseApiModel<string>
{
    public title: string;
    public website: string;
    public email: string;
    public extra_email: string;
    public phone: string;
    public extra_phone: string;
    public manager: string;
    public extra_manager: string;
    public address: string;
    public extra_address: string;
    public description: string;
    public some_info: string;
    public language_id: number;
}

export class SupplierGetFullApiModel extends SupplierBaseApiModel
{
    public products: Array<ProductGetMinApiModel>;
}

export class SupplierGetMinApiModel extends SupplierBaseApiModel
{
}

export class SupplierAddApiModel extends SupplierBaseApiModel
{
}