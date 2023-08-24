import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenSinkComponent } from './kitchen-sink.page';

describe('KitchenSinkComponent', () => {
  let component: KitchenSinkComponent;
  let fixture: ComponentFixture<KitchenSinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KitchenSinkComponent],
    });
    fixture = TestBed.createComponent(KitchenSinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
