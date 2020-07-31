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
  currencyCode: string;
  currencyName: string;
  dateStart: Date;
  dateStop: Date;

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
      elements:{
        point:{
          radius:2,
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

  ngOnInit(): void {  
    this.subscription = this.walutaService.walutaReqData$.subscribe(walutaReqData =>{ 
    //binding from form subscription
      this.isDataAvailable = false;
      this.walutaData = [], this.lineChartLabels=[], this.lineChartValues=[];
      this.currencyCode = walutaReqData.code, this.currencyName = walutaReqData.name, this.dateStart = walutaReqData.dataOd, this.dateStop = walutaReqData.dataDo;
      this.yTicksStepSize = this.dateServ.dateMonthDiff(this.dateStart,this.dateStop);
      console.log(walutaReqData);
      this.walutaService.getKursWaluty(this.dateStart, this.dateStop, this.currencyCode)
      .subscribe((data: any) => {this.walutaData.push(...data)},
        (err) => {
          console.log(err);
          alert(err);
          return;
        },
        () => { //complete subscription    
          this.walutaData.forEach(element => {
            this.lineChartLabels.push(formatDate(element.effectiveDate,"yyyy-MM-dd",'en'));
            this.lineChartValues.push(element.mid);
          });
          // chart option changes
          this.lineChartData = [{ data: this.lineChartValues, pointBackgroundColor: [], pointRadius:[]}];
          this.lineChartOptions.scales.yAxes[0].ticks.stepSize = (Math.max(...this.lineChartValues) - Math.min(...this.lineChartValues)) / (this.yTicksStepSize * 0.6667);
          this.longestPeriodObj = this.walutaService.longestPeriodOfNondecreasingRate(this.walutaData);
          this.isDataAvailable = true;
        }
      );
    });   
  }

  ngAfterViewInit() {
    this.chart.changes.subscribe(element => {
      if(this.isDataAvailable){
        console.log("chart changes!");
        for (var i=0; i<this.chart.first.datasets[0].data.length; i++){
          if (this.longestPeriodObj.dateStart <= new Date(this.chart.first.labels[i].toString()) 
          && new Date(this.chart.first.labels[i].toString()) < this.longestPeriodObj.dateStop )
          {
            this.chart.first.datasets[0].pointBackgroundColor[i] = this.colorAccent;
            this.chart.first.datasets[0].pointRadius[i] = 3.5;
          }
          else 
          { 
            this.chart.first.datasets[0].pointBackgroundColor[i] = 'rgba(148,159,177,1)';
            this.chart.first.datasets[0].pointRadius[i] = 2;
          } 
        }
        this.chart.first.update(2000);
      }
    })
  }

}
