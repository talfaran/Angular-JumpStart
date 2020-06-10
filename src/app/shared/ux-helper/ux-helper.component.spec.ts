import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxHelperComponent } from './ux-helper.component';

describe('UxHelperComponent', () => {
  let component: UxHelperComponent;
  let fixture: ComponentFixture<UxHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UxHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
