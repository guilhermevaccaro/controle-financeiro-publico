import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacoesComponent } from './transacoes.component';

describe('TransacoesComponent', () => {
  let component: TransacoesComponent;
  let fixture: ComponentFixture<TransacoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransacoesComponent]
    });
    fixture = TestBed.createComponent(TransacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
