import { Component } from '@angular/core';
import { EventRestService } from 'src/app/rest/event.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {
  constructor(public eventService: EventRestService) {}

  ngOnInit() {
    this.eventService.initValue();
  }
}
