import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { EventInfoDto } from 'src/app/shared/dto/event-info.dto';
import { EventInterface } from 'src/app/shared/interfaces/event.interface';

import events from 'src/app/rest/event.json';

@Injectable()
export class EventRestService {
  updateData = new BehaviorSubject<EventInfoDto[] | null>(null);

  private lines: EventInfoDto[] = [];

  public initValue(): void {
    this.getDataFromJson().subscribe((events: EventInterface[]) => {
      events.map((event, index, arr) => {
        const line = new EventInfoDto(event);

        this.setTimestampEnd(line, arr, index);

        this.calcLineSize(line);
        this.lineByEventCode(line, event.eventCode);

        line.d = `M ${line.startX},${line.y} ${line.endX},${line.y}`;
        this.lines.push(line);

        return event;
      });

      this.initSupportLines();

      this.setNewEventValues(this.lines);
    });
  }

  public setNewEventValues(lines: EventInfoDto[]): void {
    this.updateData.next(lines);
  }

  private getDataFromJson(): Observable<EventInterface[]> {
    return of(events);
  }

  private setLastEndDate(startDate: Date): Date {
    const date = new Date(startDate);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);

    return date;
  }

  private lineByEventCode(line: EventInfoDto, code: number): void {
    switch (code) {
      case 1:
        line.color = 'red';
        line.y = 10;
        line.type = 'Off Duty';
        line.shortType = 'OFF';
        break;
      case 2:
        line.color = 'black';
        line.y = 40;
        line.type = 'Sleeper Berth';
        line.shortType = 'SB';
        break;
      case 3:
        line.color = 'green';
        line.y = 65;
        line.type = 'Driving';
        line.shortType = 'D';
        break;
      case 4:
        line.color = 'orange';
        line.y = 90;
        line.type = 'OnDuty';
        line.shortType = 'ON';
        break;
    }
  }

  private calcLineSize(line: EventInfoDto): void {
    if (!line?.eventTimestampEnd?.getTime()) {
      return;
    }

    line.durationMinutes = Math.round(
      (line?.eventTimestampEnd?.getTime() - line.eventTimestampStart?.getTime()) / 1000 / 60
    );
    line.duration = Math.round((25 * line.durationMinutes) / 60);

    line.startX = Math.round(
      line.eventTimestampStart.getHours() * 25 +
        25 * (line.eventTimestampStart.getMinutes() / 60) +
        25 * (line.eventTimestampStart.getSeconds() / 60 / 60)
    );

    line.endX = line.startX + line.duration;
  }

  private setTimestampEnd(line: EventInfoDto, arr: EventInterface[], index: number): void {
    const lastElem = index + 1 >= arr.length;
    line.eventTimestampEnd = lastElem
      ? (line.eventTimestampEnd = this.setLastEndDate(line.eventTimestampStart))
      : (line.eventTimestampEnd = new Date(arr[index + 1].eventTimestamp));
  }

  private initSupportLines(): void {
    this.lines.forEach((line, index, arr) => {
      if (index + 1 < arr.length) {
        line.supportLine = {
          x: line.endX,
          y1: line.y,
          y2: arr[index + 1].y,
          color: arr[index + 1].color,
          d: `M ${line.endX},${line.y} ${line.endX},${arr[index + 1].y}`
        };
      }
    });
  }
}
