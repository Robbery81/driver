import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { EventRestService } from 'src/app/rest/event.service';
import { TransferDataService } from 'src/app/shared/services/transfer-data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChildren('tr') rowList: QueryList<ElementRef>;

  private selectedElement: HTMLElement | null;

  constructor(public eventService: EventRestService, private transferService: TransferDataService) {}

  ngOnInit(): void {
    this.transferService.getDataFromChart.subscribe((val: number) => {
      this.setSelected(val);
    });
  }

  public setSelected(inputId: number | null, emit?: boolean) {
    const id = String(inputId);

    if (this.selectedElement?.id && this.selectedElement.id !== id) {
      this.selectedElement?.classList.remove('selected');
    }

    this.rowList?.map((item) => {
      let tr = item.nativeElement as HTMLElement;

      if (tr.id === id) {
        this.selectedElement = tr;
        this.selectedElement.classList.add('selected');

        if (emit) {
          this.transferService.setDataFromTable(inputId);
        }
      }
    });
  }
}
