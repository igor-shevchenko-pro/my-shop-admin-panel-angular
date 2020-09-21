import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { dropdownSettingsCategoriesConfig } from 'src/app/core/shared/dropdown-settings/ng-multiselect-config';
import { editorConfig } from 'src/app/core/shared/editor/editorConfig';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/file.service';
import { fileSizeValidator, fileExtensionValidator } from 'src/app/core/shared/validators/file/file-extension-validator';
import { ImageGalleryService } from 'src/app/services/image-gallery.service';
import { HttpEventType } from '@angular/common/http';
import { fileEndpoints } from 'src/app/core/configurations/api-endpoints';
import { CategoryGetMinApiModel } from 'src/app/core/api-models/category';
import { CategorySortingEnum, EntitySortingEnum, FileEntityTypeEnum } from 'src/app/core/api-models/base/enums';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {

  public categories: CategoryGetMinApiModel[] = [];
  public dropdownSettingsCategories = {};
  public editorConfig = {};
  public metaTitleSymbolsQuantity: number = 0;
  public metaDescriptionSymbolsQuantity: number = 0;
  public editorSmallDescriptionHtmlContent: string = '';
  public editorLongDescriptionHtmlContent: string = '';
  public uploadedFileIconUrl: string = null;
  public uploadedFileAvatarUrl: string = null;
  public uploadFileIconName: string = "Загрузите файл";
  public uploadFileAvatarName: string = "Загрузите файл";
  public progressIcon: number;
  public progressAvatar: number;
  public isFileIconUpload: boolean;
  public isFileAvatarUpload: boolean;
  public isFileIconSizeAppropriate: boolean;
  public isFileAvatarSizeAppropriate: boolean;
  public isFileIconExtensionAppropriate: boolean;
  public isFileAvatarExtensionAppropriate: boolean;
  private _fileIconEntityId: string = null;
  private _fileAvatarEntityId: string = null;
  private _permitedFileSize: number = 5242880; //5MB
  private _permitedExtensions = "jpg,jpeg,png";
  private _languageId: number = 1;
  private _imageGalleryId: string = null;
  private _start: number = 0;
  private _count: number = 200;
  private _sortings: CategorySortingEnum = CategorySortingEnum.ByCreateAsc;
  private _amountOfNestedFilesInImageGallery: number = 0;
  private readonly _getData = fileEndpoints.getData;

  public categoryFormModel = this._formBuilder.group({
    Title: [null, Validators.required],
    Alias: [null, Validators.required],
    Status: [true],
    ExtraTitle: [null],
    ParentCategoryId: [null],
    ParentCategoryLanguageId: [null],
    SeoTitle: [null],
    SeoKeywords: [null],
    SeoDescription: [null],
    SmallDescription: [null],
    LongDescription: [null],
    LanguageId: [null],
    ImageGalleryId: [null]
  });

  public iconFormModel = this._formBuilder.group({
    FileIcon: [null],
  });

  public avatarFormModel = this._formBuilder.group({
    FileAvatar: [null],
  });


  constructor(private _categoryService: CategoryService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _notifyService: NotificationService,
              private _modalService: NgbModal,
              private _fileService: FileService,
              private _imageGalleryService: ImageGalleryService) { }

  ngOnInit(): void {
    this.getCategories();
    //Initialize dropdownSettings from config file
    this.dropdownSettingsCategories = dropdownSettingsCategoriesConfig;
    //Initialize editorSettings from config file
    this.editorConfig = editorConfig;
  }


  public addCategory(): void {
    this.categoryFormModel.controls['LanguageId'].setValue(this._languageId);
    if (this.categoryFormModel.get('ParentCategoryId').value != null) {
      this.categoryFormModel.controls['ParentCategoryLanguageId'].setValue(this._languageId);
    }
    if (this.editorSmallDescriptionHtmlContent != null && this.editorSmallDescriptionHtmlContent.length > 0) {
      this.categoryFormModel.controls['SmallDescription'].setValue(this.editorSmallDescriptionHtmlContent);
    } else {
      this.categoryFormModel.controls['SmallDescription'].setValue(null);
    }
    if (this.editorSmallDescriptionHtmlContent != null && this.editorLongDescriptionHtmlContent.length > 0) {
      this.categoryFormModel.controls['LongDescription'].setValue(this.editorLongDescriptionHtmlContent);
    } else {
      this.categoryFormModel.controls['LongDescription'].setValue(null);
    }
    if (this._imageGalleryId != null) {
      this.categoryFormModel.controls['ImageGalleryId'].setValue(this._imageGalleryId);
    }

    this._categoryService.add(this.categoryFormModel).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this._notifyService.showSuccess("Категория создана успешно", "");
          const url = '/home/category/' + res.id;
          this._router.navigateByUrl(url);
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Duplicate name':
              this._notifyService.showError("Категория с таким названием уже существует", "");
              break;
            case 'Duplicate URL':
              this._notifyService.showError("Категория с таким URL уже существует", "");
              break;

            default:
              this._notifyService.showError("Ошибка добавления категории", "");
              break;
          }
        });
      }
    );
  }

  public countSymbolsMetaTitle(): void {
    let symbols: string = this.categoryFormModel.get('SeoTitle').value;
    this.metaTitleSymbolsQuantity = symbols.length;
  }

  public countSymbolsMetaDescription(): void {
    let symbols: string = this.categoryFormModel.get('SeoDescription').value;
    this.metaDescriptionSymbolsQuantity = symbols.length;
  }

  public uploadIconHandler($event): void {
    this.progressIcon = null;
    this.isFileIconSizeAppropriate = true;
    this.isFileIconExtensionAppropriate = true;
    this.uploadFileIconName = "Загрузите файл";

    // get fileIcon
    let file = $event.target.files[0];
    if (file != null) {
      this.isFileIconUpload = true;
      this.uploadFileIconName = file.name;
      this.isFileIconSizeAppropriate = fileSizeValidator(file.size, this._permitedFileSize);
      this.isFileIconExtensionAppropriate = fileExtensionValidator(this._permitedExtensions, file.type);

      // save icon
      if (this.isFileIconUpload && this.isFileIconSizeAppropriate && this.isFileIconExtensionAppropriate) {
        // create imageGalleryId
        if (this._imageGalleryId == null) {
          this.createImageGallery(file, FileEntityTypeEnum.IconImage);
        } else {
          this.sendFile(file, FileEntityTypeEnum.IconImage);
        }
      }
    }
  }

  public uploadAvatarHandler($event): void {
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
        // create imageGalleryId
        if (this._imageGalleryId == null) {
          this.createImageGallery(file, FileEntityTypeEnum.AvatarImage);
        } else {
          this.sendFile(file, FileEntityTypeEnum.AvatarImage);
        }
      }
    }
  }

  public openModal(content): void {
    this._modalService.open(content);
  }

  public deleteFileIcon(): void {
    this._modalService.dismissAll();
    this.progressIcon = null;
    this.iconFormModel.controls['FileIcon'].setValue("");
    this.isFileIconUpload = false;
    this.uploadedFileIconUrl = null;
    this.uploadFileIconName = "Загрузите файл";
    this._fileService.delete(this._fileIconEntityId)
      .subscribe(
        (res: SuccessResponseApiModel) => {
          // console.log(res);
          this._amountOfNestedFilesInImageGallery--;
          // check imageGallery -> if empty than delete
          this.deleteImageGalleryIfEmpty();
        },
        errors => {
          // console.log(errors);
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
          this._amountOfNestedFilesInImageGallery--;
          // check imageGallery -> if empty than delete
          this.deleteImageGalleryIfEmpty();
        },
        errors => {
          // console.log(errors);
        }
      );
  }

  public onActiveStatusChange($event): void {
    // console.log($event);
  }


  private getCategories(): void {
    this._categoryService.getAll(this._start, this._count, this._sortings).subscribe(
      (res: PaginationResponseApiModel<CategoryGetMinApiModel, CategorySortingEnum>) => {
        // console.log(res);
        if (res != null && res.models.length > 0) {
          this.categories = res.models;
        }
      },
      errors => {
        // console.log(errors);
      }
    );
  }

  private deleteImageGalleryIfEmpty(): void {
    if (this._amountOfNestedFilesInImageGallery == 0 && this._imageGalleryId != null) {
      //delete imageGallery
      this._imageGalleryService.delete(this._imageGalleryId)
        .subscribe(
          (res: SuccessResponseApiModel) => {
            // console.log(res)
            this._imageGalleryId = null;
          },
          errors => {
            // console.log(errors);
          }
        );
    }
  }

  private createImageGallery(file: File, fType: FileEntityTypeEnum): void {
    this._imageGalleryService.add().subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this._imageGalleryId = res.id;
          // save file
          this.sendFile(file, fType);
        }
      },
      errors => {
        // console.log(errors);
      }
    );
  }

  private sendFile(file: File, fType: FileEntityTypeEnum): void {
    let fileName = file.name.split('.')[0];
    let fileExtension = file.type.split('/')[1];

    //fileType_ImageGallery consist of two parameters 
    let galleryId = this._imageGalleryId ?? "";
    let fileType_ImageGallery = `${fType.toString()};${galleryId}`;

    const formData: FormData = new FormData();
    formData.append(fileName, file, fileType_ImageGallery);

    // pass formData with file into fileService
    this._fileService.add(formData)
      .subscribe(
        (res: any) => {
          if (res.type == HttpEventType.UploadProgress && fType == FileEntityTypeEnum.IconImage) {
            this.progressIcon = Math.round((100 / res.total) * res.loaded);
          }
          if (res.type == HttpEventType.UploadProgress && fType == FileEntityTypeEnum.AvatarImage) {
            this.progressAvatar = Math.round((100 / res.total) * res.loaded);
          }
          if (res.type == HttpEventType.Response && fType == FileEntityTypeEnum.IconImage) {
            // handle success response
            if (res.body && res.body.response == "success") {
              this.uploadedFileIconUrl = this._getData + res.body.id;
              this._fileIconEntityId = res.body.id;
              this.uploadFileIconName = `${fileName}.${fileExtension}`;
              this._amountOfNestedFilesInImageGallery++;
            }
          }
          if (res.type == HttpEventType.Response && fType == FileEntityTypeEnum.AvatarImage) {
            // handle success response
            if (res.body && res.body.response == "success") {
              this.uploadedFileAvatarUrl = this._getData + res.body.id;
              this._fileAvatarEntityId = res.body.id;
              this.uploadFileAvatarName = `${fileName}.${fileExtension}`;
              this._amountOfNestedFilesInImageGallery++;
            }
          }
        },
        errors => {
          this.progressIcon = null;
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

}
