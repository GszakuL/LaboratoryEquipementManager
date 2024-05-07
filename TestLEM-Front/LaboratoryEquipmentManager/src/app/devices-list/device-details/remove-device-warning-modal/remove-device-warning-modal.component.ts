import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-device-warning-modal',
  templateUrl: './remove-device-warning-modal.component.html',
  styleUrls: ['./remove-device-warning-modal.component.css']
})
export class RemoveDeviceWarningModalComponent {
  constructor(
    public dialogRef: MatDialogRef<RemoveDeviceWarningModalComponent>,
    public matDialog: MatDialog
  ){}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDeleteDevice(): void {
    //strzał do api z usunięciem
    //odpowiedź z info czy się udało
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(x => alert('Urządzenie zostało usunięte'));
    this.matDialog.closeAll();
  }

}
