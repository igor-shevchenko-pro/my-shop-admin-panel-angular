import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import { FileService } from 'src/app/services/file.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { HttpEventType } from '@angular/common/http';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fileSizeValidator, fileExtensionValidator } from 'src/app/core/shared/validators/file/file-extension-validator';
import { dropdownSettingsRolesConfig } from 'src/app/core/shared/dropdown-settings/ng-multiselect-config';
import { fileEndpoints } from 'src/app/core/configurations/api-endpoints';
import { RoleGetMinApiModel } from 'src/app/core/api-models/user-account/role';
import { EntityActivityStatusEnum, FileEntityTypeEnum, RoleSortingEnum, TypeModelResponseEnum } from 'src/app/core/api-models/base/enums';
import { UserGetFullApiModel } from 'src/app/core/api-models/user-account/user';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';

@Component({
  selector: 'app-manager-update',
  templateUrl: './manager-update.component.html',
  styleUrls: ['./manager-update.component.css']
})
export class ManagerUpdateComponent implements OnInit {

  public roleSelectedItems: any[] = [];
  public model: NgbDateStruct;
  public roles: Array<RoleGetMinApiModel> = [];
  public dropdownSettingsRoles = {};
  public uploadFileName: string = "Загрузите файл";
  public isFileUpload: boolean;
  public isFileSizeAppropriate: boolean;
  public isFileExtensionAppropriate: boolean;
  public progress: number;
  public uploadedFileUrl: string = null;
  private _permitedFileSize: number = 5242880; //5MB
  private _permitedExtensions = "jpg,jpeg,png";
  private _userId: string;
  private _fileId: string;
  private _start: number = 0;
  private _count: number = 200;
  private _sortings: RoleSortingEnum[] = [ RoleSortingEnum.ByCreateDesc ];
  private readonly _getData = fileEndpoints.getData;

  public userFormModel = this._formBuilder.group({
    Email: [null, [Validators.required, Validators.email]],
    Phone: [null, [Validators.required, Validators.pattern("^[0-9]+$")]],
    FirstName: [null, Validators.required],
    SecondName: [null, Validators.required],
    DateOfBirth: [null],
    Roles: [null, Validators.required],
    FileEntityId: [null],
    UserName: [null],
    Address: [null],
    GenderId: [null],
    LanguageId: [null],
    Status: [true],
  });

  public avatarFormModel = this._formBuilder.group({
    File: [null],
  });
  

  constructor(private _userService: UserService,
              private _roleService: RoleService,
              private _fileService: FileService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _notifyService: NotificationService,
              private _actRoute: ActivatedRoute,
              private _modalService: NgbModal) { }

  ngOnInit(): void {
    this._userId = this._actRoute.snapshot.params.id;
    this.getUser();
    this.getRolesMin();
    //Initialize dropdownSettings from config file
    this.dropdownSettingsRoles = dropdownSettingsRolesConfig;
  }


  public getRolesMin(): void {
    let filteredRoles: Array<RoleGetMinApiModel> = [];
    this._roleService.getAll(this._start, this._count, this._sortings, TypeModelResponseEnum.GetMinApiModel).subscribe(
      (res: PaginationResponseApiModel<RoleGetMinApiModel, RoleSortingEnum>) => {
        // console.log(res);
        if (res.models.length > 0) {
          res.models.forEach(function (item) {
            if (item.activity_status != EntityActivityStatusEnum.Inactive-2 && 
                item.activity_status != EntityActivityStatusEnum.Deleted) {
              filteredRoles.push(item);
            }
          });
          this.roles = filteredRoles;
        }
      },
      errors => {
        // console.log(errors);
      }
    );
  }

  public uploadPhotoHandler($event): void {
    this.progress = null;
    this.userFormModel.controls['FileEntityId'].setValue(null);
    this.isFileSizeAppropriate = true;
    this.isFileExtensionAppropriate = true;
    this.uploadFileName = "Загрузите файл";

    // get file
    let file = $event.target.files[0];
    if (file != null) {
      this.isFileUpload = true;
      this.uploadFileName = file.name;
      this.isFileSizeAppropriate = fileSizeValidator(file.size, this._permitedFileSize);
      this.isFileExtensionAppropriate = fileExtensionValidator(this._permitedExtensions, file.type);

      // save new photo
      if (this.isFileUpload && this.isFileSizeAppropriate && this.isFileExtensionAppropriate) {
        this.sendFile(file);
      }
    }
  }

  public updateUser(): void {
    this._userService.update(this._userId, this.userFormModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          // this._notifyService.showSuccess("Менеджер обновлен успешно", "");
          const url = '/home/manager/' + this._userId;
          this._router.navigateByUrl(url);
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Duplicate email':
              this._notifyService.showError("Этот email используется другим пользователем", "");
              break;
            case 'Duplicate phone':
              this._notifyService.showError("Этот телефон используется другим пользователем", "");
              break;

            default:
              this._notifyService.showError("Ошибка обновления менеджера", "");
              break;
          }
        });
      }
    );
  }

  public openModal(content): void {
    this._modalService.open(content);
  }

  public deleteFile(): void {
    this._modalService.dismissAll();
    this._userService.setDefaultPhoto(this._userId).subscribe(
      (res: any) => {
        // console.log(res);
        this.progress = null;
        this.userFormModel.controls['FileEntityId'].setValue(null);
        this.avatarFormModel.controls['File'].setValue("");
        this.isFileUpload = false;
        this.uploadedFileUrl = null;
        this.uploadFileName = "Загрузите файл";
        this._fileService.delete(this._fileId).subscribe(
          (result: SuccessResponseApiModel) => {
            // console.log(result);
          },
          errors => {
            // console.log(errors);
          }
        );
      },
      errors => {
        // console.log(errors);
      }
    );

  }

  
  private getUser(): void {
    this._userService.getById(this._userId, TypeModelResponseEnum.GetFullApiModel).subscribe(
      (res: UserGetFullApiModel) => {
        // console.log(res);
        this.userFormModel.controls['FirstName'].setValue(res.user_profile.first_name);
        this.userFormModel.controls['SecondName'].setValue(res.user_profile.second_name);
        this.userFormModel.controls['Phone'].setValue(res.phone);
        this.userFormModel.controls['Email'].setValue(res.email);
        this.userFormModel.controls['DateOfBirth'].setValue(res.user_profile.date_of_birth);
        this.userFormModel.controls['FileEntityId'].setValue(res.user_profile.file_id);
        this.userFormModel.controls['Status'].setValue(this.GetActivityStatus(res.activity_status));
        this._fileId = res.user_profile.file_id;
        this.uploadFileName = `${res.user_profile.file.name}.${res.user_profile.file.extension}`;
        this.uploadedFileUrl = res.user_profile.file.url;
        this.isFileUpload = true;
        let filteredRoles: Array<RoleGetMinApiModel> = [];
        if (res.roles.length > 0 && this.roleSelectedItems.length == 0) {
          res.roles.forEach(function (item) {
            if (item.title != "User" && item.title != "Customer") {
              filteredRoles.push(item);
            }
          });
          this.roleSelectedItems = filteredRoles;
        }
      },
      errors => {
        // console.log(errors);
        this._router.navigateByUrl('/home/managers');
      }
    );
  }

  private sendFile(file: File): void {
    let fileName = file.name.split('.')[0];
    let fileExtension = file.type.split('/')[1];
    let fileType = FileEntityTypeEnum.AvatarImage.toString();
    const formData: FormData = new FormData();
    formData.append(fileName, file, fileType);
    // pass formData with file into fileService
    this._fileService.add(formData).subscribe(
      (res: any) => {
        if (res.type == HttpEventType.UploadProgress) {
          this.progress = Math.round((100 / res.total) * res.loaded);
        }
        if (res.type == HttpEventType.Response) {
          // handle success response
          if (res.body && res.body.response == "success") {
            // set fileId to addManagerForm
            this._fileId = res.body.id;
            this.userFormModel.controls['FileEntityId'].setValue(res.body.id);
            this.uploadedFileUrl = this._getData + res.body.id;
            this.uploadFileName = `${fileName}.${fileExtension}`;
          }
        }
      },
      errors => {
        this.progress = null;
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'File extension must be jpeg, jpg, png or pdf':
              this._notifyService.showError("Недопустимый формат файла", "");
              break;
            case 'File size can\'t be more than 5MB':
              this._notifyService.showError("Превышен максимальный размер файла", "");
              break;

            default:
              this._notifyService.showError("Ошибка добавления файла", "");
              break;
          }
        });
      }
    );
  }

  private GetActivityStatus(status: EntityActivityStatusEnum): boolean {
    switch (status) {
      case EntityActivityStatusEnum.Inactive:
        return true;
      case EntityActivityStatusEnum.Inactive-2:
        return false;

      default:
        return true;
    }
  }

}
