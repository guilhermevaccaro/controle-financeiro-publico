import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp } from 'firebase/app';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { environment } from '../environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DespesaListaComponent } from './componentes/depesa/despesa-lista.component';
import { ReceitasListaComponent } from './componentes/receitas-lista/receitas-lista.component';
import { SaldoComponent } from './componentes/saldo/saldo.component';
import { TabelaComponent } from './componentes/tabela/tabela.component';
import { TransacaoFormComponent } from './componentes/transacao-form/transacao-form.component';
import { TransacoesListaComponent } from './componentes/transacoes-lista/transacoes-lista.component';
import { PagesComponent } from './pages/home/pages.component';

const firebaseConfig = environment.firebaseConfig;
initializeApp(firebaseConfig);

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    DespesaListaComponent,
    TransacaoFormComponent,
    ReceitasListaComponent,
    PagesComponent,
    TransacoesListaComponent,
    TabelaComponent,
    SaldoComponent,
  ],
  imports: [
    IconFieldModule,
    TabViewModule,
    TooltipModule,
    InputSwitchModule,
    InputIconModule,
    ToolbarModule,
    DropdownModule,
    InputNumberModule,
    DividerModule,
    CardModule,
    InputGroupAddonModule,
    InputGroupModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatMenuModule,
    TableModule,
    CalendarModule,
    InputTextModule,
    FloatLabelModule,

    AngularFireModule.initializeApp(firebaseConfig),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
