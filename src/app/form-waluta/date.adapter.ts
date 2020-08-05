import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root',
})
export class MyDateAdapter extends NativeDateAdapter {
  parse(dateString: string) {
    let dateSplit = dateString.split(/[.,/]/);
    if (dateSplit.length==3)
    return new Date(+dateSplit[2],+dateSplit[1]-1,+dateSplit[0],12)
  }

}