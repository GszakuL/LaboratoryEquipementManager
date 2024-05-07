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
  SerialNumber: string;
  ProductionDate?: Date;
  CalibrationPeriodInYears: number;
  LastCalibrationDate: Date;
  IsCalibrated?: boolean;
  IsCalibrationCloseToExpire?: boolean;
  StorageLocation: StorageLocationDto;
  Model: ModelDto;
}

export class StorageLocationDto {
  Building?: string;
  Department?: string;
  Room?: string;
  PlacementDescription?: string;
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
