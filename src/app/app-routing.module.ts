import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/home/pages.component';
import { ReceitasComponent } from './pages/receitas/receitas.component';
import { DespesasComponent } from './pages/despesas/despesas.component';
import { PendentesComponent } from './pages/pendentes/pendentes.component';
import { TransacoesComponent } from './pages/transacoes/transacoes.component';

const routes: Routes = [
  { path: 'dashboard', component: PagesComponent },
  { path: 'transacoes', component: TransacoesComponent },
  { path: 'receitas', component: ReceitasComponent },
  { path: 'despesas', component: DespesasComponent },
  { path: 'pendentes', component: PendentesComponent },
  // { path: 'login', component: LoginComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
