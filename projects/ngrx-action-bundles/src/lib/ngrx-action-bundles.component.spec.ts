import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxActionBundlesComponent } from './ngrx-action-bundles.component';

describe('NgrxActionBundlesComponent', () => {
  let component: NgrxActionBundlesComponent;
  let fixture: ComponentFixture<NgrxActionBundlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgrxActionBundlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgrxActionBundlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
