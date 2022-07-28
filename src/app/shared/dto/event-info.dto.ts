import { EventInterface } from 'src/app/shared/interfaces/event.interface';

export class EventInfoDto {
  id: number;
  eventTimestampStart: Date;
  eventTimestampEnd?: Date;
  durationMinutes?: number;
  duration?: number;
  startX?: number;
  endX?: number;
  type: string;
  shortType: string;
  color?: string;
  d?: string;
  y?: number;

  supportLine: any;

  constructor(data: EventInterface) {
    this.id = data.id;
    this.eventTimestampStart = new Date(data.eventTimestamp);
  }
}
