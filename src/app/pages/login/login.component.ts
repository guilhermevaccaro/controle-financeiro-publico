import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;
  loginError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.inicializaForm();
  }
  inicializaForm() {
    this.form = this.formBuilder.group({
      login: [''],
      senha: [''],
    });
  }

  onClick() {
    this.auth
      .login(this.form.value['login'], this.form.value['senha'])
      .subscribe(
        () => {
          // Login bem-sucedido, redirecionar para a página inicial ou fazer outra ação necessária
          console.log('Login bem-sucedido');
          this.router.navigate(['home']);

          // Redirecionar para a página inicial, ou fazer outra ação necessária
        },
        (error) => {
          // Login falhou, exibir mensagem de erro
          console.error('Erro ao fazer login:', error);
          this.loginError = true;
        }
      );
  }
}
