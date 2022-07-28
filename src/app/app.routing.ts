import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./containers/main-content/main-content.module').then(m => m.MainContentModule),
  },
  {
    path: '**',
    loadChildren: () => import('./containers/not-found/not-found.module').then(m => m.NotFoundModule)
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRouting {}
