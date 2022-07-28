import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferDataService {
  getDataFromChart = new BehaviorSubject<any | null>(null);
  getDataFromTable = new BehaviorSubject<any | null>(null);

  setDataFromChart(lines: any) {
    this.getDataFromChart.next(lines);
  }

  setDataFromTable(lines: any) {
    this.getDataFromTable.next(lines);
  }
}
