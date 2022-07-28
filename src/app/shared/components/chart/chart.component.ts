import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs';

import { EventRestService } from 'src/app/rest/event.service';
import { TransferDataService } from 'src/app/shared/services/transfer-data.service';

import { EventInfoDto } from 'src/app/shared/dto/event-info.dto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @ViewChildren('linesPath') linesPath: QueryList<ElementRef>;

  @ViewChild('svg') svg: ElementRef;

  public chartWidth = 600;

  public isShowDragLines = false;
  public selectedDragLine: 'start' | 'end';
  public selectedLineElem: HTMLElement;

  public lines: EventInfoDto[] = [];
  public startDragPosition = '';
  public endDragPosition = '';

  private mainDataSubscription: Subscription;
  private updateDataSubscription: Subscription;

  constructor(
    private transferService: TransferDataService,
    private eventService: EventRestService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public ngOnInit(): void {
    this.updateDataSubscription = this.transferService.getDataFromTable.subscribe((val) => {
      this.linesPath?.forEach((line) => {
        const lineId = Number(line.nativeElement.id.slice(5));

        if (lineId === val) {
          if (this.isShowDragLines) {
            this.selectedLineElem?.classList?.remove('selected-line');
            this.isShowDragLines = !this.isShowDragLines;
          }

          this.clickOnLine(line.nativeElement as HTMLElement);
        }
      });
    });

    this.mainDataSubscription = this.eventService.updateData.subscribe((lines) => {
      if (lines) {
        this.lines = lines;
      }
    });
  }

  public ngOnDestroy(): void {
    this.mainDataSubscription.unsubscribe();
    this.updateDataSubscription.unsubscribe();
  }

  public dragAndDrop(event: MouseEvent, position: 'start' | 'end'): void {
    this.selectedDragLine = position;
    this.startDrag(event, event.target as HTMLElement);
  }

  public clickByLine(event: MouseEvent): void {
    if (this.isShowDragLines) {
      this.selectedLineElem?.classList?.remove('selected-line');
      this.isShowDragLines = !this.isShowDragLines;
      this.transferService.setDataFromChart(null);
      return;
    }

    this.clickOnLine(event.target as HTMLElement, true);
  }

  private clickOnLine(target: HTMLElement, emit?: boolean) {
    const lineId = Number(target.getAttribute('id')?.slice(5));

    this.selectedLineElem = target;
    this.selectedLineElem.classList.add('selected-line');
    let d = target.getAttribute('d') as string;
    this.setDragLinePositions(d);
    this.isShowDragLines = !this.isShowDragLines;

    if (emit) {
      this.transferService.setDataFromChart(lineId);
    }
  }

  private setDragLinePositions(d: string): void {
    let { lineStartX, lineEndX } = this.getLinePosition(d);
    this.endDragPosition = `M ${lineEndX},0 ${lineEndX},105`;
    this.startDragPosition = `M ${lineStartX},0 ${lineStartX},105`;
  }

  private getLinePosition(d: string): any {
    const [, startPoint, endPoint] = d.split(' ');

    const lineStartX = startPoint.split(',')[0];
    const lineStartY = startPoint.split(',')[1];

    const lineEndX = endPoint.split(',')[0];
    const lineEndY = endPoint.split(',')[1];

    return {
      lineStartX,
      lineStartY,
      lineEndX,
      lineEndY
    };
  }

  private changeSelectedLine(line: HTMLElement, x: number): void {
    const selectedLineId = Number(line.getAttribute('id')?.slice(5));

    const d = line.getAttribute('d') as string;
    let { lineStartX, lineStartY, lineEndX, lineEndY } = this.getLinePosition(d);

    switch (this.selectedDragLine) {
      case 'start':
        this.changeEventTime(selectedLineId, lineStartX - x);
        this.changeSupportLine(selectedLineId - 1, x);
        this.changeSiblingLine(selectedLineId - 1, x);
        lineStartX = x;
        break;
      case 'end':
        const siblingStartX = this.changeSiblingLine(selectedLineId + 1, x);
        this.changeEventTime(selectedLineId + 1, siblingStartX - x);
        this.changeSupportLine(selectedLineId, x);
        lineEndX = x;
        break;
    }

    line.setAttribute('d', `M ${lineStartX},${lineStartY} ${lineEndX},${lineEndY}`);
  }

  private changeEventTime(id: number, delta: number) {
    let time = delta * 60 * 1000 * 2.4;
    this.lines[id - 2].eventTimestampStart = new Date(this.lines[id - 2].eventTimestampStart.getTime() - time);

    this.eventService.setNewEventValues(this.lines);
  }

  private changeSupportLine(lineId: number, x: number): void {
    this.svg.nativeElement.childNodes.forEach((node: HTMLElement) => {
      if (node.nodeType === 1) {
        if (Number(node.getAttribute('id')?.slice(9)) === lineId) {
          let { lineStartX, lineStartY, lineEndX, lineEndY } = this.getLinePosition(node.getAttribute('d') || '');

          switch (this.selectedDragLine) {
            case 'end':
              lineStartX = x;
              lineEndX = x;
              break;
            case 'start':
              lineStartX = x;
              lineEndX = x;
              break;
          }

          node.setAttribute('d', `M ${lineStartX},${lineStartY} ${lineEndX},${lineEndY}`);
        }
      }
    });
  }

  private changeSiblingLine(siblingLineId: number, x: number): any {
    let start;

    this.svg.nativeElement.childNodes.forEach((node: HTMLElement) => {
      if (node.nodeType === 1) {
        if (Number(node.getAttribute('id')?.slice(5)) === siblingLineId) {
          let { lineStartX, lineStartY, lineEndX, lineEndY } = this.getLinePosition(node.getAttribute('d') || '');
          start = lineStartX;

          switch (this.selectedDragLine) {
            case 'end':
              lineStartX = x;
              break;
            case 'start':
              lineEndX = x;
              break;
          }

          node.setAttribute('d', `M ${lineStartX},${lineStartY} ${lineEndX},${lineEndY}`);
        }
      }
    });

    return start;
  }

  private startDrag(event: MouseEvent, draggedElem: HTMLElement): void {
    event.preventDefault();
    event.stopPropagation();
    let point = this.svg.nativeElement.createSVGPoint();
    point = point.matrixTransform(this.svg.nativeElement.getScreenCTM()?.inverse());

    const mousemove = (event: MouseEvent) => {
      event.preventDefault();
      point.x = event.clientX;
      point.y = event.clientY;
      let cursor = point.matrixTransform(this.svg.nativeElement.getScreenCTM()?.inverse());

      if (cursor.x < 0) {
        cursor.x = 0;
      }

      if (cursor.x > this.chartWidth) {
        cursor.x = this.chartWidth;
      }

      draggedElem.setAttribute('d', `M ${cursor.x},0 ${cursor.x},105`);

      this.changeSelectedLine(this.selectedLineElem, cursor.x);
    };

    const mouseup = (event: MouseEvent) => {
      this.document.removeEventListener('mousemove', mousemove);
      this.document.removeEventListener('mouseup', mouseup);
    };

    this.document.addEventListener('mousemove', mousemove);
    this.document.addEventListener('mouseup', mouseup);
  }
}
