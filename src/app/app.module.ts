import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { NgbModule, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TreeTableModule } from 'primeng/treetable';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressBarModule } from 'primeng/progressbar';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastrModule } from 'ngx-toastr';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputNumber';
import { RatingModule } from 'primeng/rating';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/home/sidebar/sidebar.component';
import { NavbarComponent } from './components/home/navbar/navbar.component';
import { ControlSidebarComponent } from './components/home/control-sidebar/control-sidebar.component';
import { FooterComponent } from './components/home/footer/footer.component';
import { LoginComponent } from './components/account/login/login.component';
import { RecoveryPasswordRequestComponent } from './components/account/recovery-password-request/recovery-password-request.component';
import { RecoveryPasswordComponent } from './components/account/recovery-password/recovery-password.component';
import { AccountComponent } from './components/account/account.component';
import { HomeComponent } from './components/home/home.component';
import { ContentComponent } from './components/home/content/content.component';
import { ListManagersComponent } from './components/home/content/manager/list-managers/list-managers.component';
import { ManagerAddComponent } from './components/home/content/manager/manager-add/manager-add.component';
import { RolesComponent } from './components/home/content/role/roles.component';
import { ManagerProfileComponent } from './components/home/content/manager/manager-profile/manager-profile.component';
import { ManagerUpdateComponent } from './components/home/content/manager/manager-update/manager-update.component';
import { ListCategoriesComponent } from './components/home/content/category/list-categories/list-categories.component';
import { CategoryComponent } from './components/home/content/category/category/category.component';
import { CategoryAddComponent } from './components/home/content/category/category-add/category-add.component';
import { CategoryUpdateComponent } from './components/home/content/category/category-update/category-update.component';
import { CategoryDuplicateComponent } from './components/home/content/category/category-duplicate/category-duplicate.component';
import { BrandAddComponent } from './components/home/content/brand/brand-add/brand-add.component';
import { ListBrandsComponent } from './components/home/content/brand/list-brands/list-brands.component';
import { BrandComponent } from './components/home/content/brand/brand/brand.component';
import { BrandUpdateComponent } from './components/home/content/brand/brand-update/brand-update.component';
import { BrandDuplicateComponent } from './components/home/content/brand/brand-duplicate/brand-duplicate.component';
import { ListSuppliersComponent } from './components/home/content/supplier/list-suppliers/list-suppliers.component';
import { SupplierComponent } from './components/home/content/supplier/supplier/supplier.component';
import { SupplierAddComponent } from './components/home/content/supplier/supplier-add/supplier-add.component';
import { SupplierUpdateComponent } from './components/home/content/supplier/supplier-update/supplier-update.component';

import { MessageService, ConfirmationService } from 'primeng/api';

import { CustomAdapter } from './core/shared/datepicker/custom-adapter';
import { CustomDateParserFormatter } from './core/shared/datepicker/custom-date-parser-formatter';
import { AuthInterceptor } from './core/auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    ControlSidebarComponent,
    FooterComponent,
    ContentComponent,
    LoginComponent,
    RecoveryPasswordRequestComponent,
    RecoveryPasswordComponent,
    AccountComponent,
    HomeComponent,
    ListManagersComponent,
    ManagerAddComponent,
    RolesComponent,
    ManagerProfileComponent,
    ManagerUpdateComponent,
    ListCategoriesComponent,
    CategoryComponent,
    CategoryAddComponent,
    CategoryUpdateComponent,
    CategoryDuplicateComponent,
    BrandAddComponent,
    ListBrandsComponent,
    BrandComponent,
    BrandUpdateComponent,
    BrandDuplicateComponent,
    ListSuppliersComponent,
    SupplierComponent,
    SupplierAddComponent,
    SupplierUpdateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    BrowserAnimationsModule,
    TreeTableModule,
    ToastrModule.forRoot({
      progressBar: true,
      // closeButton: true,
    }),
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    UiSwitchModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    ProgressBarModule,
    BlockUIModule,
    ProgressSpinnerModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    OverlayPanelModule,
    TableModule,
    DialogModule,
    BreadcrumbModule,
    ToolbarModule,
    RadioButtonModule,
    InputNumberModule,
    RatingModule,
    InputSwitchModule,
    ConfirmDialogModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // NOTE: need two next rows for providing correct ru-RU datePicker format (dd/mm/yyyy)
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
