import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, Form, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AddDeviceDto, ApiServiceService, DeviceDto, MeasuredRangeDto, MeasuredValueDto, ModelDto } from '../api-service.service';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  deviceForm: FormGroup;
  selectedFile: File;

  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiServiceService) {
    this.deviceForm = this.fb.group({
      identificationNumber: [''],
      productionDate: [''],
      lastCalibrationDate: [''],
      calibrationPeriodInYears: [''],
      isCalibrated: [''],
      isCalibrationCloseToExpire: [''],
      storageLocation: [''],
      documents: [''],

      model: this.fb.group({
        name: [''],
        serialNumber: [''],
        company: [''],
        documents: [''],
        cooperatedModelsIds: [''],

        measuredValues: this.fb.array([])
      })
    })
  }
  get measuredValues() {
    return this.deviceForm.get('model.measuredValues') as FormArray;
  }

  ngOnInit(): void {}

  removeMeasuredValue(index: number): void {
    this.measuredValues.removeAt(index);
  }

  measuredValueRanges(index: number): FormArray {
    return this.measuredValues.at(index).get('ranges') as FormArray;
  }

  removeRangeForMeasuredValue(measuredValueIndex: number, rangeIndex: number): void {
    this.measuredValueRanges(measuredValueIndex).removeAt(rangeIndex);
  }

  addRangeForMeasuredValue(rangeIndex: number) : void {
    this.measuredValueRanges(rangeIndex).push(this.addNewRangeFG());
  }

  addMeasuredValue() : void {
    this.measuredValues.push(this.addNewMeasuredValueFG());
  }

  onDeviceFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  // displayFGvalues() {
  //   let addDeviceDto = this.mapDeviceFormValuesToAddDeviceDto();

  //   console.log('deviceForm:')
  //   console.log(    this.deviceForm.value    )
  //   let measuredValues = this.deviceForm.get('model.measuredValues')?.value;
  //   console.log(measuredValues);
  //   console.log(typeof(measuredValues));

  //   console.log('addDeviceDto:')
  //   console.log(addDeviceDto);
  // }

  displayFGvalues() {
    let addDeviceDto = this.mapDeviceFormValuesToAddDeviceDto();
    console.log(addDeviceDto);
    this.apiService.createDevice(addDeviceDto).subscribe(x => alert('Urządzenie z id: '+x+' zostało dodane'));
  }

  navigateToDevicesList(): void {
    this.router.navigate(['']);
  }

  private addNewRangeFG(): FormGroup {
    return this.fb.group({
      range:'',
      accuracy:''
    })
  }

  private addNewMeasuredValueFG(): FormGroup {
    return this.fb.group({
      name: '',
      unit: '',
      ranges: this.fb.array([])
    })
  }

  private mapDeviceFormValuesToAddDeviceDto(): AddDeviceDto {
    let addDeviceDto = new AddDeviceDto();
    addDeviceDto.IdentifiactionNumber = this.getValueFromDeviceForm('identificationNumber');
    addDeviceDto.ProductionDate = this.getValueFromDeviceForm('productionDate');
    addDeviceDto.CalibrationPeriodInYears = this.getValueFromDeviceForm('calibrationPeriodInYears');
    addDeviceDto.LastCalibrationDate = this.getValueFromDeviceForm('lastCalibrationDate');
    addDeviceDto.IsCalibrated = this.getValueFromDeviceForm('isCalibrated');
    addDeviceDto.IsCalibrationCloseToExpire = this.getValueFromDeviceForm('isCalibrationCloseToExpire');
    addDeviceDto.StorageLocation = this.getValueFromDeviceForm('storageLocation');
    addDeviceDto.Documents = this.getValueFromDeviceForm('documents');//this.selectedFile;
    addDeviceDto.Model = this.getModelFromDeviceForm();

    return addDeviceDto;
  }

  private getValueFromDeviceForm(name: string): any {
    return this.deviceForm.get(name)?.value;
  }

  private getModelFromDeviceForm(): ModelDto {
    let modelDto = new ModelDto();
    modelDto.Name = this.getValueFromDeviceForm('model.name');
    modelDto.SerialNumber = this.getValueFromDeviceForm('model.serialNumber')
    modelDto.CompanyName = this.getValueFromDeviceForm('model.company');
    modelDto.Documents = this.getValueFromDeviceForm('model.modelDocuments');
    modelDto.CooperatedModelsIds = this.getValueFromDeviceForm('model.cooperatedModelsIds');
    modelDto.MeasuredValues = this.getMeasuredValuesFromDeviceForm();

    return modelDto;
  }

  private getMeasuredValuesFromDeviceForm(): MeasuredValueDto[] {
    let measuredValues = this.deviceForm.get('model.measuredValues') as FormArray;
    let measuredValueDto = new MeasuredValueDto();
    let measuredValuesDto: MeasuredValueDto[] = [];

    if(!measuredValues) {
      return [];
    }

    measuredValues.controls.forEach(x => {
      measuredValueDto.PhysicalMagnitudeName = x.get('name')?.value;
      measuredValueDto.PhysicalMagnitudeUnit = x.get('unit')?.value;
      measuredValueDto.MeasuredRanges = this.getMeasuredRangesFromDeviceForm(x);
    },
      measuredValuesDto.push(measuredValueDto));

    return measuredValuesDto;
  }

  private getMeasuredRangesFromDeviceForm(measuredValue: AbstractControl): MeasuredRangeDto[] {
    let measuredRangeDto = new MeasuredRangeDto();
    let measuredRangesDto: MeasuredRangeDto[] = [];

    let measuredRanges = measuredValue.get('ranges') as FormArray;

    measuredRanges.controls.forEach(x => {
      measuredRangeDto.AccuracyInPercent = x.get('accuracy')?.value;
      measuredRangeDto.Range = x.get('range')?.value;
    },
      measuredRangesDto.push(measuredRangeDto));

    return measuredRangesDto;
  }
}
