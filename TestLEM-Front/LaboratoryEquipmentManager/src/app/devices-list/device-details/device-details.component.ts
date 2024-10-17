import { AfterViewInit, Component, Inject, OnInit, model } from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle }
from '@angular/material/dialog';
import { ApiServiceService, DeviceDto, ModelDto } from 'src/app/api-service.service';
import { RemoveDeviceWarningModalComponent } from './remove-device-warning-modal/remove-device-warning-modal.component';
import { DialogRef } from '@angular/cdk/dialog';
import { ModelDetailsComponent } from './model-details/model-details/model-details.component';
import { Router } from '@angular/router';

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
    private apiService: ApiServiceService,
    private router: Router
  ){}

  shouldDisplayMeasuredValuesTable = false;
  deviceDto = this.data.deviceDto;
  rowspan = 1;
  deviceDocuments = this.deviceDto.deviceDocuments;
  modelDocuments = this.deviceDto.modelDocuments;
  relatedModels = this.deviceDto.relatedModels;

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

  // getDeviceDocuemnts() {
  //   console.log(this.deviceDto);
  //   this.deviceDocuments = this.deviceDto.deviceDocuments;
  //   let deviceDocumentsNames: string[] = [];
  //   this.deviceDocuments.forEach((x: any) => {
  //     deviceDocumentsNames.push(x.name)
  //   });
  //   return deviceDocumentsNames.join(',');
  // }

  getModelDocuemnts() {
    this.modelDocuments = this.deviceDto.modelDocuments;
    let modelDocumentsNames: string[] = [];
    this.modelDocuments.forEach((x: any) => {
      modelDocumentsNames.push(x.name)
    });
    return modelDocumentsNames.join(',');
  }

  getRelatedDeviceName(relatedModel: any): string {
    let relatedModelName = relatedModel.name;
    return relatedModelName;
  }

  // openDeviceDetails(deviceId: any) {
  //   this.service.getDeviceDetailsById(deviceId).subscribe(deviceDetails => {
  //     this.dialog.open(DeviceDetailsComponent, {data: {deviceDto: deviceDetails}, autoFocus: false});
  //   })
  //   //this.dialog.open(DeviceDetailsComponent, {data: {deviceDto: device}, autoFocus: false });
  // }

  downloadFile(file: any, event: Event, downloadFor: string) {
    const deviceWord = "device";
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
      }
    );
  }

  openModelDetails(modelId: number, modelName: string, event: Event) {
    event.preventDefault();

    this.apiService.getModelDetails(modelId, modelName).subscribe((modelDetails: any) => {
      this.dialog.open(ModelDetailsComponent, {data: {modelDetails: modelDetails}, autoFocus: false});
    })
  }

  navigateToEdit(): any {
    this.router.navigate(['edit-device'], { state: { data: this.deviceDto } })
    this.dialog.closeAll();
  }

}


