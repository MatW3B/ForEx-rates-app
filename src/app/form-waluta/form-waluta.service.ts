import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValidatorFn, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';

import { DateService } from '../shared/date.service';
import { currencyArray } from '../models/form-waluta-model';

@Injectable({
  providedIn: 'root'
})
export class FormWalutaService {
  urlCurrencyNames: string;
  
  constructor(private http: HttpClient, private dateServ: DateService) { 
    this.urlCurrencyNames = "http://api.nbp.pl/api/exchangerates/tables/A/2020-01-02/";
  }

  getCurrencyNames() {
    return this.http.get(this.urlCurrencyNames).pipe(
      map((currencyData: any[]) => currencyData[0].rates)
    );
  }

  dateWeekValidator() : ValidatorFn{
    return (group: FormGroup): ValidationErrors => {
       const startCtrl = group.controls['start'];
       const endCtrl = group.controls['end'];
       if (startCtrl.valid && endCtrl.valid){
        if (this.dateServ.dateDifference(startCtrl.value,endCtrl.value,false) < 7) {
          endCtrl.setErrors({notWeekDifference: true});
        } else {
          endCtrl.setErrors(null);
        }
       }
       return;
    };
  }

  currencyNameValidator(currencies: currencyArray[]): ValidatorFn{
    return (control: AbstractControl): {[key: string]:boolean} | null => {
      if (!currencies.map(({currency,code}) => (code)).includes(control.value)) {
        return {currencyInvalid: true}
      } 
      return;
    }
  } 

}
