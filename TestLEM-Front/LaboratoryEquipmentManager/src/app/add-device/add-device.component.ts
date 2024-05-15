import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, Form, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../api-service.service';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  deviceForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiServiceService) {
    this.deviceForm = this.fb.group({
      identificationNumber: [''],
      productionDate: [''],
      lastCalibrationDate: [''],
      calibrationPeriodInYears: [''],
      isCalibrated: [''],
      isCalibrationCloseToExpire: [''],
      storageLocation: [''],
      deviceDocuments: [''],

      model: this.fb.group({
        name: [''],
        serialNumber: [''],
        companyName: [''],
        modelDocuments: [''],
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

  displayFGvalues() {
    console.log('deviceForm:')
    console.log(    this.deviceForm.value    )
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
      ranges: this.fb.array([])
    })
  }
}
