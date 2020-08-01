import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { WalutaModel } from '../models/waluta-model';
import { currencyArray } from '../models/form-waluta-model';
import { WalutaService } from '../shared/waluta.service';
import { FormWalutaService } from './form-waluta.service';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-form-waluta', // css
  templateUrl: './form-waluta.component.html',
  styleUrls: ['./form-waluta.component.css'],
})
export class FormWalutaComponent implements OnInit { 
  @ViewChild(MatExpansionPanel) expansionPanel: MatExpansionPanel;
  currencyCtrl: FormControl;
  dateRangeCtrl: FormGroup;
  walutaInput: WalutaModel;
  minDate: Date;
  maxDate: Date;
  currencies: currencyArray[];
  filteredCurrencies: Observable<currencyArray[]>;
  
  constructor(private walutaService: WalutaService, private fwService: FormWalutaService) { 
    this.currencyCtrl = new FormControl('',Validators.required);
    this.dateRangeCtrl = new FormGroup({
      start: new FormControl('',Validators.required),
      end: new FormControl('',Validators.required), 
    });
    this.dateRangeCtrl.setValidators(this.fwService.dateWeekValidator())

    this.maxDate = new Date();
    this.minDate = new Date(2002,1,2);
    this.walutaInput = {
      name: '',
      code: '',
    };
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
    this.expansionPanel.close();
    this.walutaService.shareWalutaReqData(
      { 
        name: this.walutaInput.name,
        code: this.walutaInput.code,
        dataOd: this.dateRangeCtrl.controls.start.value,
        dataDo: this.dateRangeCtrl.controls.end.value,
      });  
  };
  
  ngOnInit(): void {
    this.fwService.getCurrencyNames().subscribe(
      (currencyData: any) => {
        this.currencies = currencyData;
        this.currencyCtrl.setValidators([this.fwService.currencyNameValidator(this.currencies)]);
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
