import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  readonly apiUrl = 'http://localhost:5181/api/'

  constructor(private http: HttpClient) { }

  getDevicesList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'device');
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
