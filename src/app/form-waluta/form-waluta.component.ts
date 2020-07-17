import { Component, OnInit } from '@angular/core';

import { WalutaModel } from '../models/waluta-model';
import { WalutaService } from '../shared/waluta.service';

@Component({
  selector: 'app-form-waluta', // css
  templateUrl: './form-waluta.component.html',
  styleUrls: ['./form-waluta.component.css'],
})
export class FormWalutaComponent implements OnInit {
  walutaInput: WalutaModel;
  minDate: Date;
  maxDate: Date;
  
  constructor(private walutaService: WalutaService) { 
    this.maxDate = new Date();
    this.minDate = new Date(2002,1,2);
   }
  
  setRequestData():void{
    this.walutaService.shareWalutaReqData(this.walutaInput);  
  };
  
  ngOnInit(): void {
    this.walutaInput = {
      nazwa: 'USD',
      dataDo: new Date('2020-07-14'),
      dataOd: new Date('2020-07-01'),
    };
  }
}
