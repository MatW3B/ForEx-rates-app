import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';

import { WalutaModel, longestPeriod } from '../models/waluta-model';
import { WalutaService } from "../shared/waluta.service";
import { DateService } from "../shared/date.service";

import { globals } from "../shared/globals";

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
  currency: {
    code: string,
    name: string,
  };
  date: {
    start: Date,
    stop: Date;
  };

  colorAccent: string;
  textStyle: Object;
  //chart opts
  gridLineColor: string;
  yTicksStepSize: number;

  lineChartType: string;
  lineChartOptions: (ChartOptions) ;
  lineChartColors: Color[]
  lineChartLabels: Label[];
  lineChartValues: number[];
  lineChartData: ChartDataSets[];
  isDataAvailable: boolean;

  chartPlaceholder: BaseChartDirective;
  @ViewChildren(BaseChartDirective) chart: QueryList<BaseChartDirective>;

  constructor(private walutaService: WalutaService, private dateServ: DateService) 
  { 
    this.currency = {
      code: '',
      name: '',
    }
    this.date = {
      start: new Date(),
      stop: new Date(),
    }
    
    this.colorAccent = globals.primaryAccentColor;
    this.textStyle = {color: this.colorAccent};
    this.gridLineColor = 'rgba(50,50,50,50)';
    this.lineChartValues=[];
    this.lineChartLabels=[];
    this.lineChartType = "line";
    this.lineChartColors  = [
      { // grey
        backgroundColor: 'rgba(148,159,177,0.3)',
        borderColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];
    this.lineChartOptions = {
      responsive:true,
      maintainAspectRatio:false,
      elements:{
        point:{
          radius:2,
          },
      },
      scales:{
        xAxes:[{
          type:"time",
          time:{
            unitStepSize:1
          },
          ticks:{
            fontColor:"white",
          },
          gridLines:{
            zeroLineColor: this.gridLineColor,
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
  }

  private _initCurrencyData(walutaData):void {
    this.currency.code = walutaData.code;
    this.currency.name = walutaData.name; 
    this.date.start = walutaData.dataOd;
    this.date.stop = walutaData.dataDo;
  }

  private _setChartData(walutaData):void {
    this.lineChartLabels=[], this.lineChartValues=[];
    walutaData.forEach(element => {
      this.lineChartLabels.push(formatDate(element.effectiveDate,"yyyy-MM-dd",'en'));
      this.lineChartValues.push(element.mid);
    });
    this.lineChartData = [{ data: this.lineChartValues, pointBackgroundColor: [], pointRadius:[]}];
    // setting scale
    var monthDiff = this.dateServ.dateMonthDiff(this.date.start,this.date.stop);
    if (monthDiff > 3) {
      this.lineChartOptions.scales.xAxes[0].time.unit = "month";
      this.lineChartOptions.scales.yAxes[0].ticks.stepSize = Math.round((Math.max(...this.lineChartValues) - Math.min(...this.lineChartValues)) / (monthDiff * 0.6667));
    } else {
      this.lineChartOptions.scales.xAxes[0].time.unit = "day";
      this.lineChartOptions.scales.yAxes[0].ticks.stepSize = Math.round((Math.max(...this.lineChartValues) - Math.min(...this.lineChartValues)) / this.dateServ.dateDifference(this.date.stop,this.date.start,false))
    }
    this.longestPeriodObj = this.walutaService.longestPeriodOfNondecreasingRate(walutaData);
  }

  ngOnInit(): void {  
    this.subscription = this.walutaService.walutaReqData$.subscribe(walutaReqData =>{ 
    //binding from form subscription
      this.isDataAvailable = false;
      this._initCurrencyData(walutaReqData);
      this.walutaService.getKursWaluty(this.date.start, this.date.stop, this.currency.code)
      .subscribe(
        (data: any) => { this._setChartData([...data]) },
        (err) => {
          alert(err.statusText);
          return }, 
        () => { this.isDataAvailable = true }
      );
    });   
  }

  ngAfterViewInit() {
    this.chart.changes.subscribe(element => {
      if(this.isDataAvailable && this.longestPeriodObj.length!=0){
        console.log("chart changes!");
        for (var i=0; i<this.chart.first.datasets[0].data.length; i++){
          
          if (this.longestPeriodObj.dateStart <= new Date(this.chart.first.labels[i].toString()) 
          && new Date(this.chart.first.labels[i].toString()) <= this.longestPeriodObj.dateStop )
          {
            this.chart.first.datasets[0].pointBackgroundColor[i] = this.colorAccent;
            this.chart.first.datasets[0].pointRadius[i] = 3.5;
          } else { 
            this.chart.first.datasets[0].pointBackgroundColor[i] = 'rgba(148,159,177,1)';
            this.chart.first.datasets[0].pointRadius[i] = 2;
          } 
        }
        this.chart.first.update(2000);
      }
    })
  }

}
