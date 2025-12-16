import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { RightPageComponent } from './right-page/right-page.component';
import { LeftPageComponent } from './left-page/left-page.component';
import { MastermindComponent } from './mastermind/mastermind.component';

const routes: Routes = [
  { path: 'about', component: AboutPageComponent },
  { path: 'right', component: RightPageComponent, data: { animation: 'isRight' } },
  { path: 'left', component: LeftPageComponent, data: { animation: 'isLeft' } },
  { path: 'mastermind', component: MastermindComponent, data: { animation: 'isRight' } },
  { path: '', redirectTo: 'mastermind', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
