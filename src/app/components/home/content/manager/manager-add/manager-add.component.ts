import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from 'src/app/core/shared/datepicker/datepicker-i18n';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { RoleService } from 'src/app/services/role.service';
import { Router } from '@angular/router';
import { dropdownSettingsRolesConfig } from 'src/app/core/shared/dropdown-settings/ng-multiselect-config';
import { fileSizeValidator, fileExtensionValidator } from 'src/app/core/shared/validators/file/file-extension-validator';
import { FileService } from 'src/app/services/file.service';
import { HttpEventType } from '@angular/common/http';
import { fileEndpoints } from 'src/app/core/configurations/api-endpoints';
import { RoleGetMinApiModel } from 'src/app/core/api-models/user-account/role';
import { EntityActivityStatusEnum, FileEntityTypeEnum, RoleSortingEnum, TypeModelResponseEnum } from 'src/app/core/api-models/base/enums';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';

@Component({
  selector: 'app-manager-add',
  templateUrl: './manager-add.component.html',
  styleUrls: ['./manager-add.component.css'],
  providers: [
    // define custom NgbDatepickerI18n provider
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
  ]
})
export class ManagerAddComponent implements OnInit {

  public model: NgbDateStruct;
  public roles: Array<RoleGetMinApiModel> = [];
  public dropdownSettingsRoles = {};
  public uploadFileName: string = "Загрузите файл";
  public isFileUpload: boolean;
  public isFileSizeAppropriate: boolean;
  public isFileExtensionAppropriate: boolean;
  public progress: number;
  public uploadedFileUrl: string = null;
  private _fileEntityId: string = null;
  private _permitedFileSize: number = 5242880; //5MB
  private _permitedExtensions = "jpg,jpeg,png";
  private readonly _getData = fileEndpoints.getData;
  private _start: number = 0;
  private _count: number = 200;
  private _sortings: Array<RoleSortingEnum> = [ RoleSortingEnum.ByCreateDesc ];
  private _query: string = null;

  public userFormModel = this._formBuilder.group({
    UserName: [null],
    Email: [null, [Validators.required, Validators.email]],
    Phone: [null, [Validators.required, Validators.pattern("^[0-9]+$")]],
    Password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    Roles: [null, Validators.required],
    Address: [null],
    DateOfBirth: [null],
    GenderId: [null],
    LanguageId: [null],
    FirstName: [null, Validators.required],
    SecondName: [null, Validators.required],
    Status: [true],
    FileEntityId: [null]
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
              private _modalService: NgbModal) { }

  ngOnInit(): void {
    this.getRoles();
    //Initialize dropdownSettings from config file
    this.dropdownSettingsRoles = dropdownSettingsRolesConfig;
  }


  public addUser(): void {
    this._userService.add(this.userFormModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this._notifyService.showSuccess("Менеджер создан успешно", "");
          
          const url = '/home/manager/' + res.id;
          this._router.navigateByUrl(url);
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'User with this email already exist':
              this._notifyService.showError("Пользователь с таким email уже существует", "");
              break;
            case 'User with this phone already exist':
              this._notifyService.showError("Пользователь с таким телефоном уже существует", "");
              break;

            default:
              this._notifyService.showError("Ошибка добавления менеджера", "");
              break;
          }
        });
      }
    );
  }

  public deleteFile(): void {
    this._modalService.dismissAll();
    this.progress = null;
    this.userFormModel.controls['FileEntityId'].setValue(null);
    this.avatarFormModel.controls['File'].setValue("");
    this.isFileUpload = false;
    this.uploadedFileUrl = null;
    this.uploadFileName = "Загрузите файл";
    this._fileService.delete(this._fileEntityId)
    .subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
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

      // save photo
      if (this.isFileUpload && this.isFileSizeAppropriate && this.isFileExtensionAppropriate) {
        this.sendFile(file);
      }
    }
  }

  public openModal(content): void {
    this._modalService.open(content);
  }


  private getRoles(): void {
    let filteredRoles: RoleGetMinApiModel[] = [];
    this._roleService.getAll(this._start, this._count, this._sortings, TypeModelResponseEnum.GetMinApiModel).subscribe(
      (res: PaginationResponseApiModel<RoleGetMinApiModel, RoleSortingEnum>) => {
        if (res.models.length > 0) {
          res.models.forEach(function (item) {
            if(item.title != "User" && item.title != "Customer" 
            && item.activity_status != EntityActivityStatusEnum.Inactive-2 
            && item.activity_status != EntityActivityStatusEnum.Deleted){
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
              this.userFormModel.controls['FileEntityId'].setValue(res.body.id);
              this.uploadedFileUrl = this._getData + res.body.id;
              this._fileEntityId = res.body.id;
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

}