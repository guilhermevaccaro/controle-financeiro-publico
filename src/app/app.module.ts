import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import localePt from '@angular/common/locales/pt';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DespesaListaComponent } from './componentes/depesa/despesa-lista.component';
import { ReceitasListaComponent } from './componentes/receitas-lista/receitas-lista.component';
import { SaldoComponent } from './componentes/saldo/saldo.component';
import { TabelaComponent } from './componentes/tabela/tabela.component';
import { TransacaoFormComponent } from './componentes/transacao-form/transacao-form.component';
import { TransacoesListaComponent } from './componentes/transacoes-lista/transacoes-lista.component';
import { PagesComponent } from './pages/home/pages.component';
import { LoginComponent } from './pages/login/login.component';
import { MesesComponent } from './componentes/meses/meses.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environment';
import { ContatosFormComponent } from './contatos-form/contatos-form.component';
import { ContatosListComponent } from './contatos-list/contatos-list.component';

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
    LoginComponent,
    SaldoComponent,
    MesesComponent,
    ContatosFormComponent,
    ContatosListComponent,
  ],
  imports: [
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
    MatTabsModule,
    MatTooltipModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // Inicializa o AngularFire com as configurações do ambiente
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
