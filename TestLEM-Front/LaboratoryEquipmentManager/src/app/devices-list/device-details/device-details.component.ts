import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle }
from '@angular/material/dialog';
import { ApiServiceService, DeviceDto, ModelDto } from 'src/app/api-service.service';
import { RemoveDeviceWarningModalComponent } from './remove-device-warning-modal/remove-device-warning-modal.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { deviceDto: any },
    private dialog: MatDialog,
    private selfDialog: DialogRef<DeviceDetailsComponent>,
    private apiService: ApiServiceService
  ){}

  shouldDisplayMeasuredValuesTable = false;
  deviceDto = this.data.deviceDto;
  rowspan = 1;
  deviceDocuments = this.deviceDto.deviceDocuments;
  modelDocuments = this.deviceDto.modelDocuments;

  ngOnInit(): void {
    console.log(this.data)
    this.setDisplayMeasuredValuesTable();
  }

  onDeleteDevice(): void {
    this.dialog.open(RemoveDeviceWarningModalComponent);
  }

  onClose(): void {
    this.selfDialog.close();
  }

  setRowspan(measuredValue: any): number {
    console.log(measuredValue.measuringRanges.length);
    return measuredValue.measuringRanges.length;
  }

  setDisplayMeasuredValuesTable() {
    this.shouldDisplayMeasuredValuesTable = this.deviceDto.measuredValues.length > 0;
  }

  getDeviceDocuemnts() {
    console.log(this.deviceDto);
    this.deviceDocuments = this.deviceDto.deviceDocuments;
    let deviceDocumentsNames: string[] = [];
    this.deviceDocuments.forEach((x: any) => {
      deviceDocumentsNames.push(x.name)
    });
    return deviceDocumentsNames.join(',');
  }

  getModelDocuemnts() {
    this.modelDocuments = this.deviceDto.modelDocuments;
    let modelDocumentsNames: string[] = [];
    this.modelDocuments.forEach((x: any) => {
      modelDocumentsNames.push(x.name)
    });
    return modelDocumentsNames.join(',');
  }

  downloadFile(file: any, event: Event, downloadFor: string) {
    const deviceWord = "document";
    const modelWord = "model";

    event.preventDefault();

    let documentName: string = file.name;
    let modelId: string = this.deviceDto.modelId;
    let deviceId: string = this.deviceDto.deviceId;

    if (downloadFor === deviceWord) {
      modelId = "";
    } else if( downloadFor === modelWord) {
      deviceId = "";
    }

    this.apiService.downloadFile(documentName, modelId, deviceId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error downloading file:', error);
        // Handle error as needed
      }
    );
  }

}


