import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderRollerComponent } from './loader-roller.component';

describe('LoaderRollerComponent', () => {
  let component: LoaderRollerComponent;
  let fixture: ComponentFixture<LoaderRollerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderRollerComponent]
    });
    fixture = TestBed.createComponent(LoaderRollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
