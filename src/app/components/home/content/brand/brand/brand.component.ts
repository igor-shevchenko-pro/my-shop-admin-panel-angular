import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from 'src/app/services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { FileService } from 'src/app/services/file.service';
import { BrandGetMinApiModel } from 'src/app/core/api-models/brand';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

  public brandId: string;
  public title: string;
  public alias: string;
  public brandStatus: boolean = true;
  public description: string;
  public seoTitle: string = "";
  public seoKeywords: string = "";
  public seoDescription: string = "";
  public fileAvatarUrl: string = null;
  public fileAvatarId: string = null;
  public metaTitleSymbolsQuantity: number = 0;
  public metaDescriptionSymbolsQuantity: number = 0;


  constructor(private _actRoute: ActivatedRoute,
              private _modalService: NgbModal,
              private _brandService: BrandService,
              private _router: Router,
              private _fileService: FileService,
              private _notifyService: NotificationService) { }

  ngOnInit(): void {
    this.brandId = this._actRoute.snapshot.params.id;
    this.getById();
  }

  
  private getById(): void {
    this._brandService.getById(this.brandId).subscribe(
      (res: BrandGetMinApiModel) => {
        // console.log(res);
        this.title = res.title;
        this.alias = res.alias;
        this.description = res.description;
        this.seoTitle = res.seo_title;
        this.seoKeywords = res.seo_keywords.join('; ');
        this.seoDescription = res.seo_description;
        this.fileAvatarUrl = res?.file?.url;
        this.fileAvatarId = res?.file?.id;
        if (res.activity_status == 1) this.brandStatus = false;
      },
      errors => {
        // console.log(errors);
        this._router.navigateByUrl('/home/brands');
      }
    );
  }

  public openModal(content): void {
    this._modalService.open(content);
  }

  public countSymbolsMetaTitle(): void {
    // let symbols: string = this.addBrandModel.get('SeoTitle').value;
    // this.metaTitleSymbolsQuantity = symbols.length;
  }

  public countSymbolsMetaDescription(): void {
    // let symbols: string = this.addBrandModel.get('SeoDescription').value;
    // this.metaDescriptionSymbolsQuantity = symbols.length;
  }

  public delete(): void {
    this._modalService.dismissAll();
    this._brandService.delete(this.brandId).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this._notifyService.showSuccess("Бренд удален успешно", "");
          //delete avatar-file of brand
          if (this.fileAvatarId != null) {
            this._fileService.delete(this.fileAvatarId).subscribe(
              (res: SuccessResponseApiModel) => {
                // console.log(res);
                this._router.navigateByUrl('/home/brands');
              },
              errors => {
                console.log(errors);
              }
            );
          } else {
            this._router.navigateByUrl('/home/brands');
          }
        }
      },
      errors => {
        console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._notifyService.showError("Бренд не найден", "Ошибка удаления бренда");
              break;

            default:
              this._notifyService.showError("Ошибка удаления бренда", "");
              break;
          }
        });
      }
    );
  }

}
