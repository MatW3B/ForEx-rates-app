import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';

import { WalutaModel, WalutaDataModel, longestPeriod } from '../models/waluta-model';
import { WalutaService } from "../shared/waluta.service";

@Component({
  selector: 'app-wykres-waluta',
  templateUrl: './wykres-waluta.component.html',
  styleUrls: ['./wykres-waluta.component.css'],
})
export class WykresWalutaComponent implements OnInit {
  walutaData: any;
  walutaReqData: WalutaModel;
  subscription: Subscription;
  longestPeriodObj: longestPeriod;
  periodDateStart: Date;
  periodDateEnd: Date;
  currencyName: string;
  dateStart: Date;
  dateStop: Date;
  view: any[] = [700,300];

  //chart opts
  gridLineColor: string = 'rgba(50,50,50,50)';
  pointBackgroundColors = [];
  lineChartType = "line";
  lineChartOptions: (ChartOptions) = {
    responsive:true,
    elements:{
      point:{
        radius:2,
        backgroundColor: this.pointBackgroundColors,
      },
    },
    scales:{
      xAxes:[{
        type:"time",
        time:{
          unit: 'month',
          unitStepSize:1
        },
        ticks:{
          fontColor:"white",
        },
        gridLines:{
          color:this.gridLineColor,
        }
      }],
      yAxes:[{
        ticks:{
          stepSize: 0.05  ,
          fontColor:"white",
        },
        gridLines:{
          color:this.gridLineColor,
        }
      }], 
    }
  };
  lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  lineChartLabels: Label[];
  lineChartValues: number[];
  lineChartData: ChartDataSets[];

  chartPlaceholder: BaseChartDirective;
  @ViewChildren(BaseChartDirective) chart: QueryList<BaseChartDirective>;

  constructor(private walutaService: WalutaService) { this.lineChartValues=[],this.lineChartLabels=[]; }

  ngOnInit(): void {  
    this.subscription = this.walutaService.walutaReqData$.subscribe(walutaReqData =>{ //binding from form subscription
      this.walutaData = [], this.lineChartLabels=[], this.lineChartValues=[];
      this.currencyName = walutaReqData.nazwa, this.dateStart = walutaReqData.dataOd, this.dateStop = walutaReqData.dataDo;
      this.walutaService.getKursWaluty(this.dateStart, this.dateStop, this.currencyName)
      .subscribe((data: any) => {this.walutaData.push(...data)},
        (err) => console.log(err),
        () => { //complete subscription    
          this.walutaData.forEach(element => {
            this.lineChartLabels.push(formatDate(element.effectiveDate,"yyyy-MM-dd",'en'));
            this.lineChartValues.push(element.mid);
          });
          this.lineChartData = [{ data: this.lineChartValues, pointBackgroundColor: [], backgroundColor: [], pointRadius:[]}];
          this.longestPeriodObj = this.walutaService.longestPeriodOfNondecreasingRate(this.walutaData);
        }
      );
    });   
  }

  ngAfterViewInit() {
    this.chart.changes.subscribe(element => {
      if(this.longestPeriodObj){
        for (var i=0; i<this.chart.first.datasets[0].data.length; i++){
          if (this.longestPeriodObj.dateStart <= new Date(this.chart.first.labels[i].toString()) 
          && new Date(this.chart.first.labels[i].toString()) <= this.longestPeriodObj.dateStop )
          {
            this.chart.first.datasets[0].pointBackgroundColor[i] = 'purple';
            this.chart.first.datasets[0].pointRadius[i] = 3.5;
          }
          else 
          { 
            this.chart.first.datasets[0].pointBackgroundColor[i] = 'rgba(148,159,177,1)';
            this.chart.first.datasets[0].pointRadius[i] = 2;
          } 
        }
        this.chart.first.update();
      }
    })
  }

}
