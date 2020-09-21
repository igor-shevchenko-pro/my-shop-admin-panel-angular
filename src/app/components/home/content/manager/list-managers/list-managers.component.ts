import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { FileService } from 'src/app/services/file.service';
import { EntityActivityStatusEnum, TypeModelResponseEnum, UserSortingEnum } from 'src/app/core/api-models/base/enums';
import { UserGetFullApiModel } from 'src/app/core/api-models/user-account/user';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { PaginationResponseApiModel } from 'src/app/core/api-models/base/pagination-response';

@Component({
  selector: 'app-list-managers',
  templateUrl: './list-managers.component.html',
  styleUrls: ['./list-managers.component.css']
})
export class ListManagersComponent implements OnInit {

  public managers: Array<UserGetFullApiModel>;
  private _userId: string;
  private _fileId: string;
  private _start: number = 0;
  private _count: number = 100;
  private _sortings: Array<UserSortingEnum> = [ UserSortingEnum.ByCreateDesc ];

  constructor(private _userService: UserService,
              private _modalService: NgbModal,
              private _notifyService: NotificationService,
              private _fileService: FileService) {
    this.managers = new Array<UserGetFullApiModel>();
  }

  ngOnInit(): void {
    this.getManagers();
  }


  public getManagers(): void {
    let tempRoles: Array<string> = new Array<string>();
    this._userService.getManagers(this._start, this._count, this._sortings, TypeModelResponseEnum.GetFullApiModel).subscribe(
      (res: PaginationResponseApiModel<UserGetFullApiModel, UserSortingEnum>) => {
        // console.log(res);
        if (res.models.length > 0) {
          res.models.forEach(element => {
            element.roles.forEach(item => {
              tempRoles.push(item.title);
            });
            // element.rolesForView = tempRoles.join(' / ');
          });
        }
        this.managers = res.models;
      },
      errors => {
        // console.log(errors);
      }
    );
  }

  public deleteManager(): void {
    this._modalService.dismissAll();
    //delete USER
    this._userService.delete(this._userId).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this.getManagers();
          this._notifyService.showSuccess("Менеджер удален успешно", "");
          this._userId = null;
          //delete USER'S FILE
          this._fileService.delete(this._fileId).subscribe(
            (res: SuccessResponseApiModel) => {
              this._fileId = null;
             },
            errors => {
              // console.log(errors);
            }
          );
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._notifyService.showError("Менеджер не найден", "Ошибка удаления менеджера");
              break;

            default:
              this._notifyService.showError("Ошибка удаления менеджера", "");
              break;
          }
        });
      }
    );
  }

  public openModal(content, userId = null, fileId = null) {
    this._userId = userId;
    this._fileId = fileId;
    this._modalService.open(content);
  }

  public getManagerStatus(status: number): boolean {
    switch (status) {
      case 0:
        return true;
      case 1:
        return false;

      default:
        return true;
    }
  }

  public onChangeStatus(id: number, $event): void {
    // console.log($event);
    let status: EntityActivityStatusEnum;
    if($event == true) status = EntityActivityStatusEnum.Inactive;
    if($event == false) status = EntityActivityStatusEnum.Inactive-2;

    this._userService.changeStatus(id, status).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          // this._notifyService.showSuccess("Статус изменен успешно", "");
          this.getManagers();
        }
      },
      errors => {
        // console.log(errors);
        errors.error.errors.forEach(element => {
          switch (element) {
            case 'Entity is not found':
              this._notifyService.showError("Менеджер не найден", "Ошибка изменения статуса");
              break;

            default:
              this._notifyService.showError("Ошибка изменения статуса", "");
              break;
          }
        });
      }
    );
  }

}
