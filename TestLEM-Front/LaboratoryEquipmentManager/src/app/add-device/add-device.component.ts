import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApiServiceService } from '../api-service.service';

export class MesRange {
  value: string;
  accuracy: string;
  constructor(value: string, accuracy: string){
    this.value = value;
    this.accuracy = accuracy;
  }
}

export class MesValue {
  name: string;
  mesRanges?: MesRange[] = [];
  constructor(name: string, mesRanges: MesRange[]){
    this.name = name;
    this.mesRanges = mesRanges;
  }
}
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  devicesFC = new FormControl('');
  devicesDocumentsFC = new FormControl('');
  deviceDocuments: any[] = [];

  showMeasuredValueTable = false;
  tableHasValue = false;
  deviceDocumentsSelected = false;
  meassuredValues: any[] = [];
  measuredRanges: any[] = [];
  devices: any[] = [];
  deviceNames: any[] = [];

  measuredValueFormGroup: FormGroup;
  measuredValue = new FormControl();
  measuredRangeFormGroup: FormArray;
  measuredRange = new FormControl();
  measuredRangeAccuracy = new FormControl();

  //dodać form group tak żeby każdy formControl był unikalny, dodać warunek na wyświetlanie tabeli, przenieść add mess value tabelkę do osobnego komponentu

  valName: string = '';
  mesRng: MesRange;
  mesVal: MesValue;
  mesVals: MesValue [] = [];
  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiServiceService){}
  ngOnInit(): void {
    this.measuredValueFormGroup = this.fb.group({
      name: '',
      mesRanges: this.fb.array([])
    });

    this.apiService.getDevicesList().subscribe(devices => {
      this.devices = devices;
      devices.forEach(x => {
        console.log(x.model.name);
        this.deviceNames.push(x.model.name);
      });
      console.log(devices);
    });
  }

  onChange: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  get mesRangesForms() {
    return this.measuredValueFormGroup.get('mesRanges') as FormArray;
  }


  navigateToDevicesList(): void {
    this.router.navigate(['']);
  }

  addMeasuredValue(): void {
    if(this.measuredValue.value === null || this.measuredValue.value === ''){
      return;
    }
    // if(this.mesVals.length > 0){
    //   this.tableHasValue = true;
    // }
    this.showMeasuredValueTable = true;
    let name = this.measuredValue.value;
    this.meassuredValues.push(this.measuredValue.value);
    let mes = new MesValue(name, []);
    this.mesVals.push(mes);
    console.log('mesVals: '+this.mesVals)
  }

  addMeasuredValueRange(measuredValueId: number): void {
    this.measuredRanges.push(this.measuredRange.value);

    const mesVal = this.fb.group({
      value: [],
      accuracy: []
    });

    this.mesRangesForms.push(mesVal);

    //this.measuredRangeFormGroup.addControl('mesRange', new FormControl('', Validators.required));

    let mesRngValue = this.measuredRange.value;
    let mesRngAccuracy = this.measuredRangeAccuracy.value;

    let mesRng = new MesRange(mesRngValue, mesRngAccuracy);
    console.log('mesvals od id '+this.mesVals[measuredValueId]);
    console.log('mesvals ranges '+this.mesVals[measuredValueId].mesRanges);
    this.mesVals[measuredValueId].mesRanges?.push(mesRng);
    //this.measuredRangeFormGroup.addControl('mesRange', new FormControl('', Validators.required));

    this.measuredRange.reset();
  }

  removeMeasuredValueRange(measuredValueId: number, measuredValueRangeId: number): void {
    let mesv = this.mesVals[measuredValueId];
    mesv.mesRanges?.splice(measuredValueRangeId, 1);
  }

  removeMeasuredValue(measuredValueId: number): void {
    this.mesVals.splice(measuredValueId,1);
  }

  getValueFromDevicesFC(){
    alert(this.devicesFC.value);
  }

}
