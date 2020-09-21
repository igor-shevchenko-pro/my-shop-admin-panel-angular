import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { FileService } from 'src/app/services/file.service';
import { EntityActivityStatusEnum, TypeModelResponseEnum } from 'src/app/core/api-models/base/enums';
import { SuccessResponseApiModel } from 'src/app/core/api-models/base/success-response';
import { UserGetFullApiModel } from 'src/app/core/api-models/user-account/user';

@Component({
  selector: 'app-manager-profile',
  templateUrl: './manager-profile.component.html',
  styleUrls: ['./manager-profile.component.css']
})
export class ManagerProfileComponent implements OnInit, DoCheck {

  public userId: string;
  public userPhotoUrl: string;
  public fullName: string;
  public created: Date;
  public dateOfBirth: string;
  public phone: string;
  public email: string;
  public userRoles: string;
  public userStatus: EntityActivityStatusEnum;
  public activeStatus: boolean = true;
  private _fileId: string;
  private _userIdSecondCall: string = null;


  constructor(private _userService: UserService,
              private _actRoute: ActivatedRoute,
              private _modalService: NgbModal,
              private _router: Router,
              private _notifyService: NotificationService,
              private _fileService: FileService) { }

  ngOnInit(): void {
    this.userId = this._actRoute.snapshot.params.id;
    this.getUser();
  }

  // (КАКАЯ-ТО ДИЧЬЬЬ) - УБРАТЬ ИЛИ РАЗОБРАТЬСЯ 
  // handle possible second call of manager-profile instance from same page
  ngDoCheck(): void {
    this._userIdSecondCall = this._actRoute.snapshot.params.id;
    if (this._userIdSecondCall != null && this.userId != this._userIdSecondCall) {
      this.userId = this._userIdSecondCall;
      this._userIdSecondCall = null;
      // this._roles = [];
      this.getUser();
    }
  }


  public deleteManager(): void {
    this._modalService.dismissAll();
    //delete user
    this._userService.delete(this.userId).subscribe(
      (res: SuccessResponseApiModel) => {
        // console.log(res);
        if (res.response == "success") {
          this._notifyService.showSuccess("Менеджер удален успешно", "");
          //delete USER'S FILE
          this._fileService.delete(this._fileId).subscribe(
            (res: SuccessResponseApiModel) => {
              this._fileId = null;
              this._router.navigateByUrl('/home/managers');
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

  public openModal(content): void {
    this._modalService.open(content);
  }


  private getUser(): void {
    let tempRoles: Array<string> = new Array<string>();
    this._userService.getById(this.userId, TypeModelResponseEnum.GetFullApiModel).subscribe(
      (res: UserGetFullApiModel) => {
        // console.log(res);
        this.userPhotoUrl = res.user_profile.file.url;
        this.fullName = res.user_profile.first_name + ' ' + res.user_profile.second_name;
        this.created = res.created;
        this.dateOfBirth = res.user_profile.date_of_birth;
        this.phone = res.phone;
        this.email = res.email;
        this.userStatus = res.activity_status;
        if (res.activity_status == 1) this.activeStatus = false;
        this._fileId = res.user_profile.file_id;
        res.roles.forEach(element => tempRoles.push(element.title));
        this.userRoles = tempRoles.join(' / ');
      },
      errors => {
        // console.log(errors);
        this._router.navigateByUrl('/home/managers');
      }
    );
  }

}
