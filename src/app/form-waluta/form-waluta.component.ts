import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { WalutaModel } from '../models/waluta-model';
import { currencyArray } from '../models/form-waluta-model';
import { WalutaService } from '../shared/waluta.service';

@Component({
  selector: 'app-form-waluta', // css
  templateUrl: './form-waluta.component.html',
  styleUrls: ['./form-waluta.component.css'],
})
export class FormWalutaComponent implements OnInit {
  urlCurrencyNames: string;
  walutaInput: WalutaModel;
  minDate: Date;
  maxDate: Date;
  currencyCtrl = new FormControl();
  currencies: currencyArray[];
  filteredCurrencies: Observable<currencyArray[]>;
  
  constructor(private walutaService: WalutaService, private http: HttpClient) { 
    this.urlCurrencyNames = "http://api.nbp.pl/api/exchangerates/tables/A/2020-01-02/";
    this.maxDate = new Date();
    this.minDate = new Date(2002,1,2);
    this.walutaInput = {
      name: '',
      code: '',
      dataDo: new Date('2020-07-14'),
      dataOd: new Date('2018-07-14'),
    };
   }

  getCurrencyNames() {
    return this.http.get(this.urlCurrencyNames).pipe(
      map((currencyData: any[]) => currencyData[0].rates)
    );
  }

  private _filterCurrencies(value: string): currencyArray[] {
    console.log(value);
    const filterValue = value.toLowerCase();
    return this.currencies.filter((currency) => currency.code.toLowerCase().indexOf(filterValue) === 0);
  }

  private _setCurrencyData(currencyObj):void {
    this.walutaInput.code = currencyObj.code,
    this.walutaInput.name = currencyObj.currency;
  }
  
  setRequestData():void{
    this.walutaService.shareWalutaReqData(
      { 
        name: this.walutaInput.name,
        code: this.walutaInput.code,
        dataOd: this.walutaInput.dataOd, 
        dataDo: this.walutaInput.dataDo
      });  
  };
  
  ngOnInit(): void {
    this.getCurrencyNames().subscribe(
      (currencyData: any) => {
        this.currencies = currencyData;
        console.log(this.currencies);
      }, 
      (err) => {console.log(err)},
      () => {
        this.filteredCurrencies = this.currencyCtrl.valueChanges.pipe(
        startWith(''),
        map(currency => this._filterCurrencies(currency))
        )
      }
    )
  }
}
