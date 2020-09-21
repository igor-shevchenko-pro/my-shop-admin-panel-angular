import { Component, OnInit } from '@angular/core';
import { TypeModelResponseEnum } from 'src/app/core/api-models/base/enums';
import { RoleGetMinApiModel } from 'src/app/core/api-models/user-account/role';
import { UserGetFullApiModel } from 'src/app/core/api-models/user-account/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public userFullName: string;
  public userRoles: string;
  public userPhotoUrl: string; 
  public userId: string;
  public sharedRoles: Array<RoleGetMinApiModel>;


  constructor(private _userService: UserService) {
    this.sharedRoles = new Array<RoleGetMinApiModel>();
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  

  private getCurrentUser(): void {
    let tempRoles: Array<string> = new Array<string>();
    this._userService.getCurrentUser(TypeModelResponseEnum.GetFullApiModel).subscribe(
      (res: UserGetFullApiModel) => {
        // console.log(res);
        this.userId = res.id;
        this.userFullName = res.user_profile?.first_name + " " + res.user_profile?.second_name;
        this.userPhotoUrl = res.user_profile.file.url;
        res.roles.forEach(element => tempRoles.push(element.title));
        this.userRoles = tempRoles.join(' / ');
        this.sharedRoles = res.roles;
      },
      errors => {
        // console.log(errors);
      }
    );
  }

}