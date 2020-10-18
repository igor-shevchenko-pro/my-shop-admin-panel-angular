export enum ContactTypeEnum {
    Email = 0,
    Phone = 1,
}

export enum FrontClientTypeEnum{
    AdminPanel = 0,
    WebClient = 1,
}

export enum FileEntityTypeEnum
{
    IconImage = 0,
    AvatarImage = 1,
    Image = 2,
    Video = 3,
    Document = 4,
    Unknown = 5,
}

export enum EntityActivityStatusEnum
{
    Inactive = 0,
    Active = 1,
    Deleted = 2,
}

export enum TypeModelResponseEnum
{
    GetFullApiModel = 0,
    GetMinApiModel = 1,
}

export enum UserLanguageEnum
{
    Russian = 1,
    Ukrainian = 2,
    English = 3,
}

// Sortings start
export enum EntitySortingEnum {
    ByCreateAsc = 0,
    ByCreateDesc = 1,
    ByUpdateAsc = 2,
    ByUpdateDesc = 3,
    ByActivityStatusAsc = 4,
    ByActivityStatusDesc = 5,
}
export enum RoleSortingEnum
{
    ByCreateAsc = 0,
    ByCreateDesc = 1,
    ByUpdateAsc = 2,
    ByUpdateDesc = 3,
    ByActivityStatusAsc = 4,
    ByActivityStatusDesc = 5,
    ByTitleAsc = 6,
    ByTitleDesc = 7,
}
export enum BrandSortingEnum
{
    ByCreateAsc = 0,
    ByCreateDesc = 1,
    ByUpdateAsc = 2,
    ByUpdateDesc = 3,
    ByActivityStatusAsc = 4,
    ByActivityStatusDesc = 5,
    ByTitleAsc = 6,
    ByTitleDesc = 7,
}
export enum CategorySortingEnum
{
    ByCreateAsc = 0,
    ByCreateDesc = 1,
    ByUpdateAsc = 2,
    ByUpdateDesc = 3,
    ByActivityStatusAsc = 4,
    ByActivityStatusDesc = 5,
    ByTitleAsc = 6,
    ByTitleDesc = 7,
}
export enum SupplierSortingEnum
{
    ByCreateAsc = 0,
    ByCreateDesc = 1,
    ByUpdateAsc = 2,
    ByUpdateDesc = 3,
    ByActivityStatusAsc = 4,
    ByActivityStatusDesc = 5,
    ByTitleAsc = 6,
    ByTitleDesc = 7,
    ByEmailAsc = 8,
    ByEmailDesc = 9,
    ByExtraEmailAsc = 10,
    ByExtraEmailDesc = 11,
    ByPhoneAsc = 12,
    ByPhoneDesc = 13,
    ByExtraPhoneAsc = 14,
    ByExtraPhoneDesc = 15,
    ByManagerAsc = 16,
    ByManagerDesc = 17,
    ByExtraManagerAsc = 18,
    ByExtraManagerDesc = 19,
    ByAddressAsc = 20,
    ByAddressDesc = 21, 
    ByExtraAddressAsc = 22, 
    ByExtraAddressDesc = 23,
}
export enum UserSortingEnum
{
    ByCreateAsc = 0,
    ByCreateDesc = 1,
    ByUpdateAsc = 2,
    ByUpdateDesc = 3,
    ByActivityStatusAsc = 4,
    ByActivityStatusDesc = 5,
    ByUserNameAsc = 6,
    ByUserNameDesc = 7,
    ByEmailAsc = 8,
    ByEmailDesc = 9,
    ByPhoneAsc = 10,
    ByPhoneDesc = 11,
    ByFirstNameAsc = 12,
    ByFirstNameDesc = 13,
    BySecondNameAsc = 14,
    BySecondNameDesc = 15,
}
// Sortings finish