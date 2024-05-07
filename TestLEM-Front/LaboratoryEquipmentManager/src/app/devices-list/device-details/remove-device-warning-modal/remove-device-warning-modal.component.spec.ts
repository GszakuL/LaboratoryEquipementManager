import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDeviceWarningModalComponent } from './remove-device-warning-modal.component';

describe('RemoveDeviceWarningModalComponent', () => {
  let component: RemoveDeviceWarningModalComponent;
  let fixture: ComponentFixture<RemoveDeviceWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveDeviceWarningModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveDeviceWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
