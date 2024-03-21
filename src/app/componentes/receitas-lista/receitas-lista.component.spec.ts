import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceitasListaComponent } from './receitas-lista.component';

describe('ReceitasListaComponent', () => {
  let component: ReceitasListaComponent;
  let fixture: ComponentFixture<ReceitasListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceitasListaComponent]
    });
    fixture = TestBed.createComponent(ReceitasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
