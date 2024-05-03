import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueCompraComponent } from './estoque-compra.component';

describe('EstoqueCompraComponent', () => {
  let component: EstoqueCompraComponent;
  let fixture: ComponentFixture<EstoqueCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstoqueCompraComponent]
    });
    fixture = TestBed.createComponent(EstoqueCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
