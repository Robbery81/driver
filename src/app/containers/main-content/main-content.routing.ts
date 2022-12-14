import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainContentComponent } from 'src/app/containers/main-content/main-content.component';

const routes: Routes = [
  {
    path: '',
    component: MainContentComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MainContentRoutingModule {}
