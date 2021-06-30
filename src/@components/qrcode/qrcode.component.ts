import { Component, ViewChild, OnInit, ElementRef, Input } from"@angular/core";
import { BrowserQRCodeReader, BrowserQRCodeSvgWriter } from"@zxing/library";
import { Router } from"@angular/router";
@Component({
    selector:"qrcode",
    templateUrl:"qrcode.component.html",
    styleUrls: ["qrcode.component.css"]
})
export class QrcodeComponent implements OnInit {
    codeReader: BrowserQRCodeReader;
    codeWriter: BrowserQRCodeSvgWriter;
    videoInputDevices: MediaDeviceInfo[];
    selectedVideoInputDevice: MediaDeviceInfo;
    @ViewChild("result", { static: true }) result: ElementRef;
    @Input() width?: number;
    constructor(public router: Router) {
        this.width = 100;
    }
    @Input() text: string;
    ngOnInit() {
        this.codeWriter = new BrowserQRCodeSvgWriter();
        this.codeWriter.writeToDom(this.result.nativeElement, this.text, this.width, this.width);
    }

    ngOnChange(x) {
        this.codeWriter.writeToDom(this.result.nativeElement, this.text, this.width, this.width);
    }
}