import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransacaoFormComponent } from './componentes/transacao-form/transacao-form.component';
import { courseResolver } from './guards/resolver/resolver.resolver';
import { PagesComponent } from './pages/home/pages.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'home', component: PagesComponent },
  // { path: 'login', component: LoginComponent },
  { path: 'new/:tipo', component: TransacaoFormComponent, resolve: { transacao: courseResolver } },
  { path: 'edit/:id', component: TransacaoFormComponent, resolve: { transacao: courseResolver } },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
