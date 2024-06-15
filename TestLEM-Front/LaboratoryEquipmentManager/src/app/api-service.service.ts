import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getDeviceDetailsById(deviceId: number): Observable<Object> {
    return this.http.get(this.apiUrl + 'device/' + deviceId);
  }

  getDevicesByModelName(searchPhrase: SearchPhraseDto): Observable<Object> {
    return this.http.post(this.apiUrl + 'device/search', searchPhrase);
  }

  createDevice(addDeviceDto: any): Observable<any> {
    return this.http.post(this.apiUrl + 'device', addDeviceDto).pipe((response: any) => response);
  }

  addDocuments(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'files', formData);
  }

  downloadFile(documentName: string, modelId?: string, deviceId?: string): Observable<any>{
    let params = new HttpParams().set('documentName', documentName);

    if (modelId !== undefined) {
      params = params.set('modelId', modelId);
    }

    if (deviceId !== undefined) {
      params = params.set('deviceId', deviceId);
    }

    return this.http.get(this.apiUrl + 'files', {
      responseType: 'blob',
      params,
    });
  }
}

export class AddDeviceDto {
   IdentificationNumber: string;
   ProductionDate?: Date;
   CalibrationPeriodInYears?: number;
   LastCalibrationDate?: Date;
   IsCalibrated: boolean;
   IsCalibrationCloseToExpire?: boolean;
   StorageLocation?: string;
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
  MeasuredRanges?: MeasuredRangesDto[];
}

export class MeasuredRangesDto {
  Range: string;
  AccuracyInPercent: number;
}

export class ModelDto {
  Name: string;
  SerialNumber: string;
  CompanyName?: string;
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
