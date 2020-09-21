import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _messageService: MessageService) { }

  public showSuccess(title: string, description: string, sticky: boolean = false, key: string = null, life = null): void {
    
    this._messageService.add(
      {
        key: key,
        severity: 'success',
        summary: title,
        detail: description,
        sticky: sticky,
        life: life,
      });

  }

  public showInfo(title: string, description: string, sticky: boolean = false, key: string = null, life = null): void {
    
    this._messageService.add(
      {
        key: key,
        severity: 'info',
        summary: title,
        detail: description,
        sticky: sticky,
        life: life,
      });

  }

  public showWarn(title: string, description: string, sticky: boolean = false, key: string = null, life = null): void {
    
    this._messageService.add(
      {
        key: key,
        severity: 'warn',
        summary: title,
        detail: description,
        sticky: sticky,
        life: life,
      });

  }

  public showError(title: string, description: string, sticky: boolean = false, key: string = null, life = null): void {
    
    this._messageService.add(
      {
        key: key,
        severity: 'error',
        summary: title,
        detail: description,
        sticky: sticky,
        life: life,
      });
      
  }

}
