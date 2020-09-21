import { Injectable } from '@angular/core'; 
import { ToastrService } from 'ngx-toastr';
  
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private _toastrService: ToastrService) { }
  
  public showSuccess(message: string, title: string){
      this._toastrService.success(message, title);
  }
  
  public showError(message: string, title: string){
      this._toastrService.error(message, title);
  }
  
  public showInfo(message: string, title: string){
      this._toastrService.info(message, title);
  }
  
  public showWarning(message: string, title: string){
      this._toastrService.warning(message, title);
  }
  
}