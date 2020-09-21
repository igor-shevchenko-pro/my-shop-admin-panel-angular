import { IDropdownSettings } from 'ng-multiselect-dropdown';

export const dropdownSettingsRolesConfig: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 5,
    // limitSelection: 5,
    allowSearchFilter: true
};

export const dropdownSettingsCategoriesConfig: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'title',
    // maxHeight: 500,
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 5,
    // limitSelection: 5,
    allowSearchFilter: true
};