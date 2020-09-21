import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/account/login/login.component';
import { RecoveryPasswordComponent } from './components/account/recovery-password/recovery-password.component';
import { RecoveryPasswordRequestComponent } from './components/account/recovery-password-request/recovery-password-request.component';
import { AuthGuard } from './core/auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ListManagersComponent } from './components/home/content/manager/list-managers/list-managers.component';
import { ContentComponent } from './components/home/content/content.component';
import { ManagerAddComponent } from './components/home/content/manager/manager-add/manager-add.component';
import { RolesComponent } from './components/home/content/role/roles.component';
import { ManagerProfileComponent } from './components/home/content/manager/manager-profile/manager-profile.component';
import { ManagerUpdateComponent } from './components/home/content/manager/manager-update/manager-update.component';
import { ListCategoriesComponent } from './components/home/content/category/list-categories/list-categories.component';
import { CategoryComponent } from './components/home/content/category/category/category.component';
import { CategoryAddComponent } from './components/home/content/category/category-add/category-add.component';
import { CategoryUpdateComponent } from './components/home/content/category/category-update/category-update.component';
import { CategoryDuplicateComponent } from './components/home/content/category/category-duplicate/category-duplicate.component';
import { ListBrandsComponent } from './components/home/content/brand/list-brands/list-brands.component';
import { BrandAddComponent } from './components/home/content/brand/brand-add/brand-add.component';
import { BrandComponent } from './components/home/content/brand/brand/brand.component';
import { BrandUpdateComponent } from './components/home/content/brand/brand-update/brand-update.component';
import { BrandDuplicateComponent } from './components/home/content/brand/brand-duplicate/brand-duplicate.component';
import { ListSuppliersComponent } from './components/home/content/supplier/list-suppliers/list-suppliers.component';
import { SupplierAddComponent } from './components/home/content/supplier/supplier-add/supplier-add.component';
import { SupplierComponent } from './components/home/content/supplier/supplier/supplier.component';
import { SupplierUpdateComponent } from './components/home/content/supplier/supplier-update/supplier-update.component';

const routes: Routes = [
  { path: '', redirectTo: '/account/login', pathMatch: 'full' },
  { 
    path: 'account', component: AccountComponent,
    children: [
      { path: '', redirectTo: '/account/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'recovery_password_request', component: RecoveryPasswordRequestComponent },
      { path: 'recovery_password/:code/:contact', component: RecoveryPasswordComponent },
    ]
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ContentComponent,
        children: [
          { path: 'managers', component: ListManagersComponent },
          { path: 'update_manager/:id', component: ManagerUpdateComponent },
          { path: 'add_manager', component: ManagerAddComponent },
          { path: 'manager/:id', component: ManagerProfileComponent },
          { path: 'roles', component: RolesComponent },
          { path: 'categories', component: ListCategoriesComponent },
          { path: 'category/:id', component: CategoryComponent },
          { path: 'add_category', component: CategoryAddComponent },
          { path: 'update_category/:id', component: CategoryUpdateComponent },
          { path: 'duplicate_category/:id', component: CategoryDuplicateComponent },
          { path: 'brands', component: ListBrandsComponent },
          { path: 'add_brand', component: BrandAddComponent },
          { path: 'brand/:id', component: BrandComponent },
          { path: 'update_brand/:id', component: BrandUpdateComponent },
          { path: 'duplicate_brand/:id', component: BrandDuplicateComponent },
          { path: 'suppliers', component: ListSuppliersComponent },
          { path: 'add_supplier', component: SupplierAddComponent },
          { path: 'supplier/:id', component: SupplierComponent },
          { path: 'update_supplier/:id', component: SupplierUpdateComponent },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
