import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { ApiServiceService, PagedAndSortedQueryOfDevicesList } from 'src/app/api-service.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrl: './edit-device.component.css'
})
export class EditDeviceComponent implements AfterViewInit, OnInit {
  deviceToEdit: any;

  deviceForm: FormGroup;
  deviceQuery = new PagedAndSortedQueryOfDevicesList();
  devices: any[] = [];
  modelNameIds: any[] = [];
  modelsNames: string[] = [];
  modelsSerialNumbers: string[] = [];
  fieldRequired = 'Pole jest wymagane';
  submitted = false;
  modelInputsDisabled: boolean = false;
  modelNameInputDisabled: boolean = false;
  modelSerialNumberInputDisabled: boolean = false;
  measuredValuesControlss: FormControl[] = [];
  mesValFormArray:  FormArray = new FormArray([new FormControl]);


  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiServiceService) {
    this.deviceForm = this.fb.group({
      identificationNumber: ['', Validators.required],
      productionDate: [''],
      lastCalibrationDate: [''],
      calibrationPeriodInYears: [''],
      nextCalibrationDate: [''],
      isCalibrationCloseToExpire: [''],
      storageLocation: [''],
      documents: [null],

      model: this.fb.group({
        name: ['', Validators.required],
        serialNumber: ['', Validators.required],
        companyName: [''],
        documents: [''],
        cooperatedModelsIds: [''],

        measuredValues: this.fb.array([])
      })
    });
  }

  ngOnInit(): void {
    this.deviceToEdit = history.state.data;
    console.log(this.deviceToEdit);
    debugger;
    let measuredValues = this.deviceToEdit.measuredValues;
    const measuredValuesArray = this.deviceToEdit.measuredValues.map((value: any) => this.fb.control(value));
    this.deviceForm.setControl('measuredValues', this.fb.array(measuredValuesArray));
    this.initializeMeasuredValues(measuredValues);
  }

  initializeMeasuredValues(measuredValues: any[]) {
    measuredValues.forEach(x => {
      let physicalMagnitudeFG = this.fb.group({
        physicalMagnitudeName: [x.physicalMagnitudeName, Validators.required],
        physicalMagnitudeUnit: [x.physicalMagnitudeUnit]
      });

      this.measuredValues.push(physicalMagnitudeFG);
    });

    console.log(this.measuredValues);
  }

  ngAfterViewInit(): void {
    this.getDevices();
    this.bindOldValues();
  }
  get measuredValuesControls() {
    return (this.deviceForm.get('model.measuredValues') as FormArray).controls;
  }

  getDevices() {
    this.apiService.getDevices(this.deviceQuery).subscribe((x: any) => {
      this.devices = x.items;
      this.devices.forEach( device => {
        let modelIdName = {
          id: device.modelId,
          name: device.modelName
        };
        this.modelNameIds.push(modelIdName);
        this.modelsNames.push(device.modelName);
        this.modelsSerialNumbers.push(device.modelSerialNumber);
      })
    });
  }

  searchModelName: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) =>
				term.length < 2 ? [] : this.modelsNames.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
	);

  serchModelSerialNumber: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) =>
				term.length < 2 ? [] : this.modelsSerialNumbers.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
	);

  onModelNameSelect($event: NgbTypeaheadSelectItemEvent){
    const selectedDevice = $event.item;
    let deviceSelected = this.devices.find(x => x.modelName === selectedDevice);
    this.deviceForm.patchValue({
      model: {
        serialNumber: deviceSelected.modelSerialNumber,
        companyName: deviceSelected.producer
      }
    });
    this.modelInputsDisabled = true;
    this.modelSerialNumberInputDisabled = true;
  }

  onModelSerialNumberSelect($event: NgbTypeaheadSelectItemEvent){
    const selectedSerialNumber = $event.item;
    let deviceSelected = this.devices.find(x => x.modelSerialNumber === selectedSerialNumber);
    console.log('deviceSelected:')
    console.log(deviceSelected);
    this.deviceForm.patchValue({
      model: {
        name: deviceSelected.modelName,
        companyName: deviceSelected.producer
      }
    });
    this.modelInputsDisabled = true;
    this.modelNameInputDisabled = true;
  }

  navigateToDevicesList(): void {
    this.router.navigate(['']);
  }

  shouldShowError(controlName: string): boolean {
    const control = this.deviceForm.get(controlName);
    return control!.invalid && (control!.touched || this.submitted);
  }

  get measuredValues() {
    return this.deviceForm.get('model.measuredValues') as FormArray;
  }

  shouldShowErrorById(id: string): boolean {
    const control = document.getElementById(id) as any;
    return !control.validity.valid;
  }

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

  private addNewRangeFG(): FormGroup {
    return this.fb.group({
      range:'',
      accuracy:''
    })
  }

  private addNewMeasuredValueFG(): FormGroup {
    return this.fb.group({
      physicalMagnitudeName: ['', Validators.required],
      physicalMagnitudeUnit: '',
      ranges: this.fb.array([])
    })
  }

  private bindOldValues() {
    this.deviceForm.patchValue({
      identificationNumber: this.deviceToEdit.deviceIdentificationNumber,
      productionDate: this.deviceToEdit.productionDate,
      lastCalibrationDate: this.deviceToEdit.lastCalibrationDate,
      calibrationPeriodInYears: this.deviceToEdit.calibrationPeriodInYears,
      nextCalibrationDate: this.deviceToEdit.nextCalibrationDate,
      storageLocation: this.deviceToEdit.storageLocation,

      model: {
        name: this.deviceToEdit.modelName,
        serialNumber: this.deviceToEdit.modelSerialNumber,
        companyName: this.deviceToEdit.producer,
      }
    })
  }

}
