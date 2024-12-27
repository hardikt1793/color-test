import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseColorComponent } from './choose-color.component';

describe('ChooseColorComponent', () => {
  let component: ChooseColorComponent;
  let fixture: ComponentFixture<ChooseColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseColorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
