import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionDeviceConfirmationModal } from './edition-device-confirmation-modal.component';

describe('RemoveDeviceWarningModalComponent', () => {
  let component: EditionDeviceConfirmationModal;
  let fixture: ComponentFixture<EditionDeviceConfirmationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionDeviceConfirmationModal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionDeviceConfirmationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
