import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesesComponent } from './meses.component';

describe('MesesComponent', () => {
  let component: MesesComponent;
  let fixture: ComponentFixture<MesesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesesComponent]
    });
    fixture = TestBed.createComponent(MesesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
