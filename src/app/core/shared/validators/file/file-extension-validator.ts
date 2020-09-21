import { ValidatorFn, AbstractControl } from '@angular/forms';

export function fileSizeValidator(fileSize: number, permitedFileSize: number): boolean {
  if(fileSize <= permitedFileSize){
    return true;
  }else{
    return false;
  }
}

export function fileExtensionValidator(permitedExtensions: string, extension: string){
  if(extension == null || extension == undefined || extension == "") return false;
  let array = permitedExtensions.split(',');
  let extensionLowerCase = extension.split('/')[1].toLowerCase();
  if(array.includes(extensionLowerCase)){
    return true;
  }else{
    return false;
  }
}


// NON ACTIVE
// *ngIf="fileUpload.controls['FileEntityId'].errors?.inValidExt"
export function fileExtensionValidatorForm(validExt: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let forbidden = true;
    if (control.value) {
      const fileExt = (control.value.split('.').pop()).toLowerCase();
      validExt.split(',').forEach(ext => {
        if (ext.trim() == fileExt) {
          forbidden = false;
        }
      });
    }
    return forbidden ? { 'inValidExt': true } : null;
  };
} 