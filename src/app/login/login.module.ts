import { NgModule } from"@angular/core";
import { LoginComponent } from"./login.component";
import { ReactiveFormsModule } from"@angular/forms";
import { LoginRouting } from"./login.routing";
import { CoreModule } from"app/core/core.module";
@NgModule({    
    imports: [
        ReactiveFormsModule,
        LoginRouting,
        CoreModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
