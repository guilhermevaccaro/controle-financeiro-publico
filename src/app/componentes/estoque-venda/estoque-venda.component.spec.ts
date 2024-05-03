import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueVendaComponent } from './estoque-venda.component';

describe('EstoqueVendaComponent', () => {
  let component: EstoqueVendaComponent;
  let fixture: ComponentFixture<EstoqueVendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstoqueVendaComponent]
    });
    fixture = TestBed.createComponent(EstoqueVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
