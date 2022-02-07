import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterNotifyService {

  constructor(private toastr: ToastrService) { }

  successToaster(message: string, title: string) {
    this.toastr.success(message, title);
  }

  failToaster(message: string, title: string) {
    this.toastr.error(message, title);
  }

  infoToaster(message: string, title: string) {
    this.toastr.info(message, title);
  }

  processToasterMessage(resData: any) {
    if(resData) {
      if(resData.code>0) {
        //If code > 0 then it's success
        this.successToaster(resData.message, "Success");
      }else {
        //Otherwise Failure
        this.failToaster(resData.message, "Failure");
      }
    }
  }
}
