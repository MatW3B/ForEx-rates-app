import { Injectable } from '@angular/core';
  
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  dateDifference(date1: Date, date2: Date, ms: boolean = true): number {
    var difference = date2.valueOf() - date1.valueOf(); 
    if (ms == true) 
      { return Math.abs(difference) }
    else 
      { return Math.abs(difference) / (1000 * 60 * 60 * 24) }
  }

  dateFragmentate(dateBegin: Date, dateEnd: Date): Array<Array<Date>> {
    // create an array of dates to pass
    var dateArray = [];
    var dateStart = dateBegin;
    // assignment in case there's no need to fragmentate
    var dateStop = dateBegin;
    while(this.dateDifference(dateStart,dateEnd,false) > 367)
    {
      dateStop = new Date(dateStart.getFullYear()+1,1,1);
      dateArray.push([dateStart,dateStop]);
      dateStart = dateStop;
    }
    dateArray.push([dateStop,dateEnd])
    return dateArray; 
  }
}
