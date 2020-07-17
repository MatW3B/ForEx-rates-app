import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { WalutaModel, WalutaDataModel } from '../models/waluta-model';
import { WalutaService } from "../shared/waluta.service";

import * as d3 from "d3";

@Component({
  selector: 'app-wykres-waluta',
  templateUrl: './wykres-waluta.component.html',
  styleUrls: ['./wykres-waluta.component.css'],
  providers: [DatePipe]
})
export class WykresWalutaComponent implements OnInit {
  walutaData: any;
  walutaReqData: WalutaModel;
  subscription: Subscription;

  constructor(private walutaService: WalutaService,private datepipe: DatePipe) { }

  ngOnInit(): void {  
    this.subscription = this.walutaService.walutaReqData$.subscribe(walutaReqData =>{
      this.walutaService.getKursWaluty(this.datepipe.transform(walutaReqData.dataOd,"yyyy-MM-dd"),
        this.datepipe.transform(walutaReqData.dataDo,"yyyy-MM-dd"),walutaReqData.nazwa)
      .subscribe((data: any) => {
        this.walutaData = data;
        console.log(this.walutaData); 
      });
    });
  }

}
