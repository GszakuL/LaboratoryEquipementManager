import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'edition-device-confirmation-modal',
  templateUrl: './edition-device-confirmation-modal.component.html',
  styleUrls: ['./edition-device-confirmation-modal.component.css']
})
export class EditionDeviceConfirmationModal {
  constructor(
    public dialogRef: MatDialogRef<EditionDeviceConfirmationModal>,
    public matDialog: MatDialog
  ){}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(x => alert('Urządzenie zostało usunięte'));
    this.matDialog.closeAll();
  }

}
