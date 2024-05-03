import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages/home/pages.component';
import { TransacoesComponent } from './pages/transacoes/transacoes.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';

const routes: Routes = [
  { path: 'dashboard', component: PagesComponent },
  { path: 'transacoes', component: TransacoesComponent },
  { path: 'transacoes/receita', component: TransacoesComponent },
  { path: 'transacoes/despesa', component: TransacoesComponent },
  { path: 'estoque', component: EstoqueComponent },
  // { path: 'login', component: LoginComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
