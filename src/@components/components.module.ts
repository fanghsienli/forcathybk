import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QrcodeComponent } from "@components/qrcode/qrcode.component";
import { QrcodeReaderComponent } from "@components/qrcode/reader/qrcodeReader.component"; 
import { FormsModule } from "@angular/forms"; 
import { ScrollTopComponent } from "./scrollTop/scrollTop.component"; 
import { LoadingComponent } from "./loading/loading.component"; 
@NgModule({
    declarations: [
        ScrollTopComponent,
        QrcodeComponent,
        QrcodeReaderComponent,
        LoadingComponent
    ],
    imports: [
        FormsModule,
        CommonModule
    ],
    exports: [
        ScrollTopComponent,
        QrcodeComponent,
        QrcodeReaderComponent,
        LoadingComponent
    ]
})

export class ComponentsModule { }
