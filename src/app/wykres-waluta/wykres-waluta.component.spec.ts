import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WykresWalutaComponent } from './wykres-waluta.component';

describe('WykresWalutaComponent', () => {
  let component: WykresWalutaComponent;
  let fixture: ComponentFixture<WykresWalutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WykresWalutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WykresWalutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
