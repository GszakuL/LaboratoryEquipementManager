import { Component, OnInit } from '@angular/core';
import { ApiServiceService, DeviceDto, PagedAndSortedQueryOfDevicesList, SearchPhraseDto } from '../api-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { FormControl } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

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
  modelNameSearchFC = new FormControl();
  measuredValueSearchFC = new FormControl();
  searchPhrase = new SearchPhraseDto;

  deviceQuery = new PagedAndSortedQueryOfDevicesList();
  totalDevicesCount: number = 0;

  devicePhysicalMagnitudeNames: string[] = [];

  pagination: MatPaginatorModule;

  ngOnInit(): void {

    this.refreshDevicesList();
  }

  setInitPageSize($event: any): void {
    console.log($event.length);
  }

  refreshDevicesList(): void {
    this.deviceQuery.Page = 1;
    this.deviceQuery.PageSize = 20;
    this.service.getDevices(this.deviceQuery).subscribe((x: any) => {
      this.DevicesList = x;
      this.prepareDevicesMeasuredValuesToDisplay(this.DevicesList.items)
      this.totalDevicesCount = x.totalCount;
    });
    console.log(this.DevicesList);
  }

  onPageChanged($event: any): void {
    this.deviceQuery.Page = $event.pageIndex + 1;
    this.deviceQuery.PageSize = $event.pageSize;

    this.service.getDevices(this.deviceQuery).subscribe(x => {
      this.DevicesList = x;
      this.prepareDevicesMeasuredValuesToDisplay(this.DevicesList.items)
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
      x.measuredValues.forEach((element: any) => {
        this.devicePhysicalMagnitudeNames.push(element.physicalMagnitudeName);
      });
      let value = this.devicePhysicalMagnitudeNames.length === 0 ? "--" : this.createStringFromDevicePhysicalMagnitudeNamesList(this.devicePhysicalMagnitudeNames)
      this.measuredValuesAsStringTab.push(value);
      this.devicePhysicalMagnitudeNames = [];
    });
  }

  private createStringFromDevicePhysicalMagnitudeNamesList(devicePhysicalMagnitudeNames: any []): string {
    return devicePhysicalMagnitudeNames.join(', ');
  }
}
