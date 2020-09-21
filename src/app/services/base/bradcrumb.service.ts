import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private _baseUrl: string = '/home';

  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: this._baseUrl };

  constructor() { }

  public addBreadcrumbItem(label: string, route: string = null): void {

    let breadcrumbItem: any;
    if (route != null) breadcrumbItem = { label: label, routerLink: `${this._baseUrl}/${route}` };
    else breadcrumbItem = { label: label };
    this.breadcrumbItems.push(breadcrumbItem);
    
  }

}
