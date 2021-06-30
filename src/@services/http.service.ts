import { Injectable } from"@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from"@angular/common/http";
import { CurrentUserModel } from"@models/login";
import { Observable } from"rxjs";
import { map } from"rxjs/operators";
import { AppService } from "@services/app.service";

@Injectable({providedIn: "root"})
export class HttpService {
    currentUser: CurrentUserModel;
    constructor(private httpClient: HttpClient,
        private appService: AppService) {
    }



    create<I>(api: string, model: any): Observable<I> {
        return this.httpClient.post<I>(`${this.appService.host}/${api}`, model).pipe(map(x => x));

    }

    select<I>(api: string, model?: any, refresh?: boolean): Observable<I> {
        let params = new HttpParams({ fromObject: model });
        let headerMap = refresh ? {"x-refresh":"true"} : {};
        let headers = new HttpHeaders(headerMap);
        return this.httpClient.get<I>(`${this.appService.host}/${api}`, { headers, params }).pipe(map(x => x));
    }

    update<I>(api: string, model: any): Observable<I> {
        return this.httpClient.put<I>(`${this.appService.host}/${api}`, model).pipe(map(x => x));
    }

    delete<I>(api: string): Observable<I> {
        return this.httpClient.delete<I>(`${this.appService.host}/${api}`).pipe(map(x => x));
    }





   


    upload(api: string, files: Array<File>, folder: string) {
        var formData: any = new FormData();
        for (var i = 0; i < files.length; i++) {
         //   let fileName = Guid.newGuid()+ "." + files[i].name.split(".")[1]; 
            formData.append(folder, files[i], files[i].name);

        }
        return this.httpClient
            .post(`${this.appService.host}/${api}`, formData)
            .pipe(map(x => x));
    }



    private getHttpOptions() {
        this.currentUser = JSON.parse(localStorage.getItem("user"));
        if (this.currentUser) {
            return {
                headers: {"Authorization":"Bearer"+ this.currentUser.token }
            };
        } else {
            return { withCredentials: true };
        }
    }

    private jwtFile() {
        if (localStorage.getItem("user")) {
            let headers = new HttpHeaders({"Authorization":"Bearer"+ localStorage.getItem("token") });
            headers.append("View-Type","multipart/form-data;boundary=AaB03x");
            headers.append("Accept","application/json");
            return { headers: headers };
        } else {
            let headers = new HttpHeaders({"View-Type":"multipart/form-data;boundary=AaB03x"});
            headers.append("Accept","application/json");
            return { headers: headers, withCredentials: true };
        }
    }
}
