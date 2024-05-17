import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  readonly apiUrl = 'http://localhost:5192/api/'

  constructor(private http: HttpClient) { }

  getDevices(query : PagedAndSortedQueryOfDevicesList): Observable<any[]> {
    debugger;
    return this.http.post(this.apiUrl + 'device/sorted', query).pipe((response: any) => response);
  }

  getDevicesByModelName(searchPhrase: SearchPhraseDto): Observable<Object> {
    return this.http.post(this.apiUrl + 'device/search', searchPhrase);
  }

  createDevice(addDeviceDto: AddDeviceDto): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AddDeviceDto>(this.apiUrl + 'device', addDeviceDto, {headers}).pipe((response: any) => response);
  }
}

export class AddDeviceDto {
   IdentifiactionNumber: string;
   ProductionDate?: Date;
   CalibrationPeriodInYears?: number;
   LastCalibrationDate?: Date;
   IsCalibrated: boolean;
   IsCalibrationCloseToExpire?: boolean;
   StorageLocation?: string;
   Documents?: string[];
   Model: ModelDto;
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
  MeasuredRanges?: MeasuredRangeDto[];
}

export class MeasuredRangeDto {
  Range: string;
  AccuracyInPercent: number;
}

export class ModelDto {
  Name: string;
  SerialNumber: string;
  CompanyName: string;
  Documents?: string[];
  CooperatedModelsIds?: number[];
  MeasuredValues?: MeasuredValueDto[];
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
