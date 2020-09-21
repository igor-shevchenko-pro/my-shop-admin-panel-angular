import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { BrandService } from 'src/app/services/brand.service';
import { fileSizeValidator, fileExtensionValidator } from 'src/app/core/shared/validators/file/file-extension-validator';
import { HttpEventType } from '@angular/common/http';
import { FileService } from 'src/app/services/file.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fileEndpoints } from 'src/app/core/configurations/api-endpoints';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { FileEntityTypeEnum } from 'src/app/core/api-models/base/enums';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.css']
})
export class BrandAddComponent implements OnInit {

  public metaTitleSymbolsQuantity: number = 0;
  public metaDescriptionSymbolsQuantity: number = 0;
  public progressAvatar: number;
  public isFileAvatarUpload: boolean;
  public isFileAvatarSizeAppropriate: boolean;
  public isFileAvatarExtensionAppropriate: boolean;
  public uploadFileAvatarName: string = "Загрузите файл";
  private _fileAvatarEntityId: string = null;
  private _permitedFileSize: number = 5242880; //5MB
  private _permitedExtensions = "jpg,jpeg,png";
  public uploadedFileAvatarUrl: string = null;
  private readonly _getData = fileEndpoints.getData;

  public brandFormModel = this._formBuilder.group({
    Title: [null, Validators.required],
    Alias: [null, Validators.required],
    Status: [true],
    Description: [null],
    FileId: [null],
    SeoTitle: [null],
    SeoKeywords: [null],
    SeoDescription: [null],
  });

  public avatarFormModel = this._formBuilder.group({
    FileAvatar: [null],
  });


  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _notifyService: NotificationService,
              private _brandService: BrandService,
              private _fileService: FileService,
              private _modalService: NgbModal) { }

  ngOnInit(): void {
  }


  public add(): void {
    this.brandFormModel.controls['FileId'].setValue(this._fileAvatarEntityId);
    this._brandService.add(this.brandFormModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this._notifyService.showSuccess("Бренд создан успешно", "");
          const url = '/home/brand/' + res.id;
          this._router.navigateByUrl(url);
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Duplicate name':
              this._notifyService.showError("Бренд с таким названием уже существует", "");
              break;
            case 'Duplicate URL':
              this._notifyService.showError("Бренд с таким URL уже существует", "");
              break;

            default:
              this._notifyService.showError("Ошибка добавления бренда", "");
              break;
          }
        });
      }
    );
  }

  public countSymbolsMetaTitle(): void {
    let symbols: string = this.brandFormModel.get('SeoTitle').value;
    this.metaTitleSymbolsQuantity = symbols.length;
  }

  public countSymbolsMetaDescription(): void {
    let symbols: string = this.brandFormModel.get('SeoDescription').value;
    this.metaDescriptionSymbolsQuantity = symbols.length;
  }

  // upload avatar handle flow
  public uploadAvatarHandler($event) {
    this.progressAvatar = null;
    this.isFileAvatarSizeAppropriate = true;
    this.isFileAvatarExtensionAppropriate = true;
    this.uploadFileAvatarName = "Загрузите файл";

    // get fileAvatar
    let file = $event.target.files[0];
    if (file != null) {
      this.isFileAvatarUpload = true;
      this.uploadFileAvatarName = file.name;
      this.isFileAvatarSizeAppropriate = fileSizeValidator(file.size, this._permitedFileSize);
      this.isFileAvatarExtensionAppropriate = fileExtensionValidator(this._permitedExtensions, file.type);

      // save avatar
      if (this.isFileAvatarUpload && this.isFileAvatarSizeAppropriate && this.isFileAvatarExtensionAppropriate) {
        this.sendFile(file, FileEntityTypeEnum.AvatarImage);
      }
    }
  }

  // NonAction - only for debag
  public onActiveStatusChange($event): void {
    // console.log($event);
  }

  private sendFile(file: File, fType: FileEntityTypeEnum): void {
    let fileName = file.name.split('.')[0];
    let fileExtension = file.type.split('/')[1];

    const formData: FormData = new FormData();
    formData.append(fileName, file, fType.toString());

    // pass formData with file into fileService
    this._fileService.add(formData)
      .subscribe(
        (res: any) => {
          if (res.type == HttpEventType.UploadProgress && fType == FileEntityTypeEnum.AvatarImage) {
            this.progressAvatar = Math.round((100 / res.total) * res.loaded);
          }
          if (res.type == HttpEventType.Response && fType == FileEntityTypeEnum.AvatarImage) {
            // handle success response
            if (res.body && res.body.response == "success") {
              this.uploadedFileAvatarUrl = this._getData + res.body.id;
              this._fileAvatarEntityId = res.body.id;
              this.uploadFileAvatarName = `${fileName}.${fileExtension}`;
            }
          }
        },
        errors => {
          this.progressAvatar = null;
          // console.log(errors);
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

  public deleteFileAvatar(): void {
    this._modalService.dismissAll();
    this.progressAvatar = null;
    this.avatarFormModel.controls['FileAvatar'].setValue("");
    this.isFileAvatarUpload = false;
    this.uploadedFileAvatarUrl = null;
    this.uploadFileAvatarName = "Загрузите файл";
    this._fileService.delete(this._fileAvatarEntityId)
      .subscribe(
        (res: SuccessResponseApiModel) => {
          // console.log(res);
          this._fileAvatarEntityId = null;
        },
        errors => {
          // console.log(errors);
        }
      );
  }

  public openModal(content): void {
    this._modalService.open(content);
  }

}
