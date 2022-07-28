import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { EventRestService } from 'src/app/rest/event.service';

@NgModule({
  declarations: [ChartComponent],
  exports: [ChartComponent],
  imports: [CommonModule, GoogleChartsModule],
  providers: [EventRestService]
})
export class ChartModule {}
