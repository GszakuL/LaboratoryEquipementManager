import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle }
from '@angular/material/dialog';
import { DeviceDto, ModelDto } from 'src/app/api-service.service';
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
    private selfDialog: DialogRef<DeviceDetailsComponent>
  ){}

   deviceDto = this.data.deviceDto;
   deviceModel = this.data.deviceDto.model;
   measuredValues = this.deviceModel.measuredValues;
   meassuredValueRanges = this.measuredValues.measurmentRanges;
   rowspan = 1;

  ngOnInit(): void {
    console.log(this.measuredValues);
    console.log(this.measuredValues[0].measurmentRanges);
    let lng = this.measuredValues[0].measurmentRanges.length;
    console.log('length: '+lng);
    // this.deviceDto = this.data.deviceDto;
    // this.deviceModel = this.data.deviceDto.Model;
    // this.deviceStorageLocation = this.data.deviceDto.StorageLocation;
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
}


