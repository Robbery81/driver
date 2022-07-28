import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from 'src/app/containers/main-content/main-content.component';
import { MainContentRoutingModule } from 'src/app/containers/main-content/main-content.routing';
import { ChartModule } from 'src/app/shared/components/chart/chart.module';
import { TableModule } from 'src/app/shared/components/table/table.module';

@NgModule({
  imports: [
    RouterModule,
    ChartModule,
    CommonModule,
    MainContentRoutingModule,
    TableModule
  ],
  declarations: [
    MainContentComponent
  ]
})
export class MainContentModule {}
