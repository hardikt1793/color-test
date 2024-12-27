import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseColorComponent } from './components/choose-color/choose-color.component';

const routes: Routes = [
  {
    path: '',
    component: ChooseColorComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
