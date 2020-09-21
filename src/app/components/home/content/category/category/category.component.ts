import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { editorConfigNonEditable } from 'src/app/core/shared/editor/editorConfig';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { FileService } from 'src/app/services/file.service';
import { CategoryGetMinApiModel } from 'src/app/core/api-models/category';
import { FileEntityTypeEnum } from 'src/app/core/api-models/base/enums';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public title: string;
  public extraTitle: string = "";
  public alias: string;
  public categoryStatus: boolean = true;
  public parentCategoryTitle: string = "";
  public seoTitle: string = "";
  public seoKeywords: string = "";
  public seoDescription: string = "";
  public smallDescription: string = "";
  public longDescription: string = "";
  public editorConfig = {};
  public fileIconUrl: string = null;
  public fileAvatarUrl: string = null;
  public categoryId: string;
  private _imagesIds: string[] = [];


  constructor(private _actRoute: ActivatedRoute,
              private _router: Router,
              private _modalService: NgbModal,
              private _notifyService: NotificationService,
              private _fileService: FileService,
              private _categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryId = this._actRoute.snapshot.params.id;
    this.getCategory();
    //Initialize editorSettings from config file
    this.editorConfig = editorConfigNonEditable;
  }


  public deleteCategory(): void{
    this._modalService.dismissAll();
    this._categoryService.delete(this.categoryId).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this._notifyService.showSuccess("Категория удалена успешно", "");
          //delete nested files of category
          if(this._imagesIds.length > 0) {
            this._fileService.deleteRange(this._imagesIds).subscribe(
              (res: SuccessResponseApiModel) => {
                this._router.navigateByUrl('/home/categories');
              },
              errors => {
                // console.log(errors);
              }
            );
          }else{
            this._router.navigateByUrl('/home/categories');
          }
        }
      },
      errors => {
        console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._notifyService.showError("Категория не найдена", "Ошибка удаления категории");
              break;

            default:
              this._notifyService.showError("Ошибка удаления категории", "");
              break;
          }
        });
      }
    );
  }

  public openModal(content): void {
    this._modalService.open(content);
  }


  private getCategory(): void {
    this._categoryService.getById(this.categoryId).subscribe(
      (res: CategoryGetMinApiModel) => {
        // console.log(res);
        this.title = res.title;
        this.alias = res.alias;
        this.seoTitle = res.seo_title;
        this.seoKeywords = res.seo_keywords.join('; ');
        this.seoDescription = res.seo_description;
        this.smallDescription = res.small_description;
        this.longDescription = res.long_description;
        this.fileIconUrl = res.image_gallery?.gallery_files?.find(x => x.type == FileEntityTypeEnum.IconImage)?.url;
        this.fileAvatarUrl = res.image_gallery?.gallery_files?.find(x => x.type == FileEntityTypeEnum.AvatarImage)?.url;
        res.image_gallery?.gallery_files?.forEach(x => { this._imagesIds.push(x.id) });
        if(res.extra_title != null) this.extraTitle = res.extra_title;
        if(res.parent_category != null) this.parentCategoryTitle = res.parent_category.title;
        if(res.activity_status == 1) this.categoryStatus = false;
      },
      errors => {
        // console.log(errors);
        this._router.navigateByUrl('/home/categories');
      }
    );
  }

}
