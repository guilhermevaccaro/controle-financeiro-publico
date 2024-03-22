import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ToolbarModule } from 'primeng/toolbar';

import { environment } from '../environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DespesaListaComponent } from './componentes/depesa/despesa-lista.component';
import { MesesComponent } from './componentes/meses/meses.component';
import { ReceitasListaComponent } from './componentes/receitas-lista/receitas-lista.component';
import { SaldoComponent } from './componentes/saldo/saldo.component';
import { TabelaComponent } from './componentes/tabela/tabela.component';
import { TransacaoFormComponent } from './componentes/transacao-form/transacao-form.component';
import { TransacoesListaComponent } from './componentes/transacoes-lista/transacoes-lista.component';
import { PagesComponent } from './pages/home/pages.component';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';


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
    MesesComponent,
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    TableModule,
    MatTabsModule,
    MatTooltipModule,
    CalendarModule,
    InputTextModule,
    FloatLabelModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // Inicializa o AngularFire com as configurações do ambiente
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
