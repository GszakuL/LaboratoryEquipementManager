import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServiceService, DeviceDto, PagedAndSortedQueryOfDevicesList, SearchPhraseDto } from '../api-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedValue: number = 1;
  DevicesList: any = [];
  measuredValues: any = [];
  measuredValuesAsStringTab: string[] = [];
  serchPhraseFC = new FormControl();
  searchPhrase = new SearchPhraseDto;

  deviceQuery = new PagedAndSortedQueryOfDevicesList();
  totalDevicesCount: number = 0;

  devicePhysicalMagnitudeNames: string[] = [];

  ngOnInit(): void {

    this.refreshDevicesList();
  }

  refreshDevicesList(): void {
    this.deviceQuery.Page = 1;
    this.deviceQuery.PageSize = 10;
    this.deviceQuery.SearchTerm = "";
    this.service.getDevices(this.deviceQuery).subscribe((x: any) => {
      this.DevicesList = x;
      this.prepareDevicesMeasuredValuesToDisplay(this.DevicesList.items)
      this.totalDevicesCount = x.totalCount;
    });
    if (this.paginator){
      this.paginator.firstPage();
    }
    console.log(this.paginator);
  }

  onPageChanged($event: any): void {
    this.deviceQuery.Page = $event.pageIndex + 1;
    this.deviceQuery.PageSize = $event.pageSize;

    this.service.getDevices(this.deviceQuery).subscribe((x: any) => {
      this.DevicesList = x;
      this.prepareDevicesMeasuredValuesToDisplay(this.DevicesList.items)
    });
  }

  navigateToAddDevice(): void {
    this.router.navigate(['/add-device'])
  }

  openDeviceDetails(deviceId: any) {
    this.service.getDeviceDetailsById(deviceId).subscribe(deviceDetails => {
      this.dialog.open(DeviceDetailsComponent, {data: {deviceDto: deviceDetails}, autoFocus: false});
    })
    //this.dialog.open(DeviceDetailsComponent, {data: {deviceDto: device}, autoFocus: false });
  }

  clearList(){
    this.DevicesList = null;
  }

  find() {
    let searchPhrase = this.serchPhraseFC.value;
    console.log(searchPhrase);

    if (searchPhrase === null) {
      return;
    }
    this.deviceQuery.Page = 1;
    this.deviceQuery.PageSize = 10;
    this.deviceQuery.SearchTerm = searchPhrase;

    this.service.getDevices(this.deviceQuery).subscribe((x: any) => {
      this.DevicesList = x;
      this.prepareDevicesMeasuredValuesToDisplay(this.DevicesList.items)
      this.totalDevicesCount = x.totalCount;
    });
  }

  onSearchChanged($event: any){
    console.log('changed');
    this.refreshDevicesList();
  }

  //okres kalibracji na decimal -> min 0,5roku

  //dodatkowo powinne być dodane pole z momentem dodania urządzenia do BD
  //dodatkowe pole dla daty ważności kalibracji do wyświetlenia w tabeli
  //odświeżenie paginatora wg strony na której się akutalnie znajduje
  //to powinno być przeniesione do backEndu
  markDeviceCloseToExpire(device: any): string {
    const now = new Date();
    if(device.lastCalibrationDate === null || device.calibrationPeriodInYears === null) {
      return "";
    }
    const calibrationPeriodInYears = device.calibrationPeriodInYears;
    const lastCalibrationDate = new Date(device.lastCalibrationDate);
    const expireDate = new Date(lastCalibrationDate.setFullYear(lastCalibrationDate.getFullYear() + calibrationPeriodInYears));

    if(now > expireDate){
      return "table-danger";
    }


    const differenceInMilliseconds = expireDate.getTime() - now.getTime()
    //const isExpired = lastCalibrationDate.get
    const diffrerenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const diffrerenceInYears = diffrerenceInDays/(365.6);

    if(this.selectedValue > calibrationPeriodInYears){
      return "table-warning";
    }

    if (this.selectedValue < diffrerenceInYears){
      return "table-success";
    } else {
      return "table-warning";
    }
  }

  refreshCloseToExpireValue($event: any) {
    console.log('changed')
    console.log(this.selectedValue)
    this.refreshDevicesList();
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
    this.measuredValuesAsStringTab = [];
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
