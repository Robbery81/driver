import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { NotFoundRouting } from 'src/app/containers/not-found/not-found.routing';
import { NotFoundComponent } from 'src/app/containers/not-found/not-found.component';

@NgModule({
  declarations: [ NotFoundComponent ],
  exports: [ NotFoundComponent ],
  imports: [ NotFoundRouting, CommonModule ]
})
export class NotFoundModule {}
