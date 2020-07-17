import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { WalutaModel, WalutaDataModel } from '../models/waluta-model';
import { WalutaService } from "../shared/waluta.service";
import { DateService } from "../shared/date.service";

import * as d3 from "d3";

@Component({
  selector: 'app-wykres-waluta',
  templateUrl: './wykres-waluta.component.html',
  styleUrls: ['./wykres-waluta.component.css'],
})
export class WykresWalutaComponent implements OnInit {
  walutaData: any;
  walutaReqData: WalutaModel;
  subscription: Subscription;

  constructor(private walutaService: WalutaService, private dateServ: DateService) { }

  ngOnInit(): void {  
    this.subscription = this.walutaService.walutaReqData$.subscribe(walutaReqData =>{
      this.walutaData = [];

      this.walutaService.getKursWaluty(walutaReqData.dataOd, walutaReqData.dataDo, walutaReqData.nazwa)
      .subscribe((data: any) => {this.walutaData.push(...data)},
        (err) => console.log(err),
        () => {
          //complete subscription
          console.log(this.walutaData)
        }
      );
    });
  }

}
