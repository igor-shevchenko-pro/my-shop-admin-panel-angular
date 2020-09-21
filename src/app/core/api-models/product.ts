import { BaseApiModel } from './base/base'

export abstract class ProductBaseApiModel extends BaseApiModel<string>
{
}

export class ProductGetFullApiModel extends ProductBaseApiModel
{
}

export class ProductGetMinApiModel extends ProductBaseApiModel
{
}

export class ProductAddApiModel extends ProductBaseApiModel
{
}