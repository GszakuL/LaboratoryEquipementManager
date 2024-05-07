import { Component, OnInit } from '@angular/core';
import { ApiServiceService, DeviceDto, SearchPhraseDto } from '../api-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.css']
})
export class DevicesListComponent implements OnInit {

  constructor(
    private service: ApiServiceService,
    private router: Router,
    private dialog: MatDialog
    ){}

  DevicesList: any = [];
  measuredValues: any = []; //==> devices.model.meassuredValues.measuringRanges
  //measuredValuesAsString: string;
  measuredValuesAsStringTab: string[] = [];
  measuredValuesAsStringTab2: string[] = [];
  modelNameSearchFC = new FormControl();
  measuredValueSearchFC = new FormControl();
  searchPhrase = new SearchPhraseDto;

  deviceMeasuredValuesPhysicalMagnitudeNames: string[] = [];

  ngOnInit(): void {
    this.refreshDevicesList();
  }

  refreshDevicesList(): void {
    this.service.getDevicesList().subscribe(devices => {
      console.log(devices);
      this.prepareDevicesToDisplay(devices);
    });
  }

  navigateToAddDevice(): void {
    this.router.navigate(['/add-device'])
  }

  openDeviceDetails(device: any) {
    this.dialog.open(DeviceDetailsComponent, {data: {deviceDto: device}, autoFocus: false });
  }

  clearList(){
    this.DevicesList = null;
  }

  find() {
    let nameSearch = this.modelNameSearchFC.value;
    let measuredValueSearch = this.measuredValueSearchFC.value;
    console.log(nameSearch);
    if (nameSearch === null && measuredValueSearch === null) {
      return;
    }
    this.searchPhrase.DeviceModelName = nameSearch;
    this.searchPhrase.MeasuredValueName = measuredValueSearch;
    this.getDevicesBySearchedPhrase(this.searchPhrase);
  }

  private getDevicesBySearchedPhrase(searchPhrase: SearchPhraseDto): void {
    this.service.getDevicesByModelName(searchPhrase).subscribe(devices => {
      //this.prepareDevicesToDisplay(devices);
    })
  }

  private prepareDevicesToDisplay(devices: any[]): void {
    this.DevicesList = devices;
    this.prepareDevicesMeasuredValuesToDisplay(devices);
  }

  private prepareDevicesMeasuredValuesToDisplay(devices: any[]): void {
    devices.forEach(x => {
      x.model.measuredValues.forEach((y: any) => {
        this.deviceMeasuredValuesPhysicalMagnitudeNames.push(y.physicalMagnitudeName);
      });
      this.measuredValuesAsStringTab2.push(this.createStringFromMeasuredValues(this.deviceMeasuredValuesPhysicalMagnitudeNames));
      this.deviceMeasuredValuesPhysicalMagnitudeNames = [];
    });
  }

  private createStringFromMeasuredValues(measuredValues: any []): string {
    return measuredValues.join(', ');
  }
}
