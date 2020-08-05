import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ChartsModule } from "ng2-charts";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormWalutaComponent } from '../form-waluta/form-waluta.component';
import { WykresWalutaComponent } from '../wykres-waluta/wykres-waluta.component';

import { SortPipe } from '../shared/sort.pipe'
import { globals } from '../shared/globals';

@NgModule({
  declarations: [
    AppComponent,
    FormWalutaComponent,
    WykresWalutaComponent,
    SortPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    NativeDateModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    ChartsModule,
  ],
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    { provide: MAT_DATE_FORMATS, useValue: globals.myDateFormat },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
