import { Injectable, InjectionToken } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DeviceDetectorService } from "ngx-device-detector";
import { HttpClient } from "@angular/common/http";
import { LoginModel } from "@models/login";
import { map } from "rxjs/operators";
import { Setting } from "@models/setting";
import { Inventory } from "@entities/inventory";

export function storageFactory() {
    return typeof window === undefined || typeof localStorage === undefined
        ? null
        : localStorage;
}

export const LOCAL_STORAGE_TOKEN = new InjectionToken(
    "richeasy-storage",
    { factory: storageFactory }
);

@Injectable({ providedIn: "root" })
export class AppService {
    print: boolean;
    website: string = "hoya";
    webPort: string = "4200";
    apiPort: string = "3001";
    errors$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    positions$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    position$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    defaultSearchText$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    workOrderEvent$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    headers = new Headers();
    apiUrl: string;
    webUrl: string;
    filesUrl: string;
    presentation$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    qrcodeReader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
    inventories$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    putdown$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    filter$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    result$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    mobile: boolean = false;
    action$: BehaviorSubject<string> = new BehaviorSubject<string>(null);



    item$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    recipe$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    inventory$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    bottom$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
 
    host: string;
    loginModel: LoginModel;
    state$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    preUrl$: BehaviorSubject<string> = new BehaviorSubject<string>("")
    print$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    message$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    searchText$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    searching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    profile: Inventory;
    redirectUrl: string;
    isLoggedIn: boolean=true; 
    id: string;
    module: string;
    action: string;
    constructor(
        private httpClient: HttpClient,
        private deviceDetectorService: DeviceDetectorService
    ) {
        this.mobile = this.deviceDetectorService.isMobile();
        if (!this.mobile)this.mobile = this.deviceDetectorService.isTablet();
        this.redirectUrl = "home";
        
        let urlSegment = window.location.href.split("/");
        let app = urlSegment[3] === this.website ? ("/" + this.website) : "";
        this.webUrl = (urlSegment[0] + "//" + urlSegment[2] + app);
        this.host = (urlSegment[0] + "//" + urlSegment[2] + app).replace(this.webPort, this.apiPort); 
        this.apiUrl = this.host;
        this.filesUrl = "";
    }

    ngOnInit() {
      
    }



    getInventory() {
        return new Promise((resolve) => { 
            this.httpClient.get(`${this.host}/api/Settings`).subscribe((setting: Setting) => {
                this.isLoggedIn = true;
                this.profile = setting.profile;
                resolve();
            });
        });
    }


    ad() {
        localStorage.removeItem("ad");
        this.loginModel = new LoginModel();
        return this.httpClient.get(`${this.host}/api/Settings`, { withCredentials: true }).pipe(
            map((x) => {
                this.isLoggedIn = true;
            }));
    }

    login(username, password) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        this.loginModel = new LoginModel();
        this.loginModel.userName = username;
        this.loginModel.password = password;
        return this.httpClient.post(`${this.host}/auth/Login`, this.loginModel);
    }

    logout(): void {
        this.isLoggedIn = false;
        localStorage.removeItem("inventoriesListTempleteFilterWord");
        localStorage.removeItem("itemsListFilterWord");
        localStorage.removeItem("token");
        localStorage.removeItem("userName"); 
        this.presentation$.next(null);       
    }
}
