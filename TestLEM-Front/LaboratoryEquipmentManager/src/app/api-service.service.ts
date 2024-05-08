import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  readonly apiUrl = 'http://localhost:5192/api/'

  constructor(private http: HttpClient) { }

  getDevices(query : PagedAndSortedQueryOfDevicesList): Observable<any[]> {
    return this.http.post(this.apiUrl + 'device/sorted', query).pipe((response: any) => response);
  }

  getDevicesByModelName(searchPhrase: SearchPhraseDto): Observable<Object> {
    return this.http.post(this.apiUrl + 'device/search', searchPhrase);
  }
}

export class DeviceDto {
  Id: number;
  DeviceIdentificationNumber: number;
  ModelName: string;
  ModelSerialNumber: string;
  MeasuredValues: MeasuredValueDto[];
  StorageLocation?: string;
  ProductionDate?: Date;
  LastCalibrationDate?: Date;
  CalibrationPeriodInYears?: number;
  IsCloseToExpire?: boolean;
}

export class MeasuredValueDto {
  PhysicalMagnitudeName: string;
  PhysicalMagnitudeUnit?: string;
  MeasuredRanges?: MeasuredRangesDto[];
}

export class MeasuredRangesDto {
  Range: string;
  AccuracyInPercent: number;
}

export class ModelDto {
  Name: string;
  SerialNumber: string;
  Company: string;
  //MeassuredValues
  //ModelCharacteristics
}

export class SearchPhraseDto {
  DeviceModelName?: string;
  MeasuredValueName?: string;
}

export class PagedAndSortedQueryOfDevicesList {
  SearchTerm: string;
  SortColumn: string;
  SortOrder: string;
  Page: number;
  PageSize: number;
}
