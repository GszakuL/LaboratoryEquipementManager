import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, catchError, debounceTime, distinctUntilChanged, forkJoin, map, of, switchMap } from 'rxjs';
import { AddDeviceDto, ApiServiceService, MeasuredRangesDto, MeasuredValueDto, ModelDto, PagedAndSortedQueryOfDevicesList } from 'src/app/api-service.service';

export enum TableName {
  editedDeviceDocuments = 'editedDeviceDocuments',
  editedModelDocuments = 'editedModelDocuments',
  relatedModels = 'relatedModels'
}
@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrl: './edit-device.component.css'
})
export class EditDeviceComponent implements AfterViewInit, OnInit {
  deviceToEdit: any;
  deviceToBeEditedDto: any;

  deviceForm: FormGroup;
  deviceQuery = new PagedAndSortedQueryOfDevicesList();
  devices: any[] = [];
  modelNameIds: any[] = [];
  modelsNames: string[] = [];
  modelsSerialNumbers: string[] = [];
  fieldRequired = 'Pole jest wymagane';
  submitted = false;
  measuredValuesControlss: FormControl[] = [];
  mesValFormArray:  FormArray = new FormArray([new FormControl]);
  selectedRelatedModelsNames: any[] = [];
  relateModelsNamesToEdit: any[] = [];
  relateModelsIdsToBeRemoved: number[] = [];
  editedDeviceDocuments: any[] = [];
  deviceDocumentsIdsToBeRemoved: any[] = [];
  editedModelDocuments: any[] = [];
  modelDocumentsIdsToBeRemoved: any[] = [];
  checkedMap: {[key: string]: boolean} = {};
  selectedDeviceFiles: File[] = [];
  anyRelatedDevices: boolean = false;
  anyDeviceDocuments: boolean = false;
  anyModelDocuments: boolean = false;
  selectedModelFiles: File[] = [];
  cooperatedModelsIds: number[] = [];
  selectedModelFilesIdsToBeRemoved: number[] = [];
  selectedDeviceFilesIdsToBeRemoved: number[] = [];

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
    this.setOptionalAreasVisibility();
    this.setRelateModelsNamesToEdit(this.deviceToEdit.relatedModels);

    console.log(this.deviceToEdit);
    let measuredValues = this.deviceToEdit.measuredValues;
    this.initializeMeasuredValues(measuredValues);
    this.bindOldValues();
    this.initializeEditedDeviceDocuments(this.deviceToEdit.deviceDocuments);
    this.initializeEditedModelDocuments(this.deviceToEdit.modelDocuments);
    console.log('deviceToEdit:')
    console.log(this.deviceToEdit);

    console.log('relatedModels:')
    console.log(this.deviceToEdit.relatedModels)
  }

  private setOptionalAreasVisibility() {
    if (this.deviceToEdit.modelDocuments?.length > 0) {
      this.anyModelDocuments = true;
    }
    if (this.deviceToEdit.deviceDocuments?.length > 0) {
      this.anyDeviceDocuments = true;
    }
    if (this.deviceToEdit.relatedModels?.length > 0) {
      this.anyRelatedDevices = true;
    }
  }

  setRelateModelsNamesToEdit(relatedModelsToEdit: any[]) {
    relatedModelsToEdit.forEach(x => {
      this.relateModelsNamesToEdit.push({id: x.id, name: x.name});
    })
  }

  initializeEditedDeviceDocuments(documents: any) {
    if (documents === null) {
      return;
    }
    documents.forEach((x: any) => {
      this.editedDeviceDocuments.push({name: x.name, Id: x.id})
    })
  }

  initializeEditedModelDocuments(documents: any) {
    if (documents === null) {
      return;
    }
    documents.forEach((x: any) => {
      this.editedModelDocuments.push({name: x.name, Id: x.id})
    })
  }

  initializeMeasuredValues(measuredValues: any[]) {
    const measuredValuesArray = this.deviceForm.get('model.measuredValues') as FormArray;
    measuredValuesArray.clear();
    if (measuredValues === null) {
      return;
    }

    measuredValues.forEach(x => {
      const rangesArray = this.fb.array([] as FormGroup[]);

      if(x.measuredRanges != null){
        x.measuredRanges.forEach((y: any) => {
          rangesArray.push(this.fb.group({
            accuracyInPercent: [y.accuracyInPercent],
            range: [y.range]
          }));
        });
      }

      const physicalMagnitudeFG = this.fb.group({
        physicalMagnitudeName: [x.physicalMagnitudeName],
        physicalMagnitudeUnit: [x.physicalMagnitudeUnit],
        ranges: rangesArray
      });

      measuredValuesArray.push(physicalMagnitudeFG);
    });
  }

  private hasFormChanged(newEditedAddDeviceDto: AddDeviceDto): boolean {
    let devicesTheSame = this.compareDevices(this.deviceToBeEditedDto, newEditedAddDeviceDto);
    return devicesTheSame
      && this.selectedDeviceFiles.length == 0
      && this.selectedModelFiles.length == 0
      && this.deviceDocumentsIdsToBeRemoved.length == 0
      && this.modelDocumentsIdsToBeRemoved.length == 0
      && this.selectedRelatedModelsNames.length == 0
      && this.relateModelsIdsToBeRemoved.length == 0
  }

  onSubmit() {
    debugger;
    this.submitted = true;
    if (this.deviceForm.invalid) {
      return;
    }

    let newEditedAddDeviceDto = this.mapDeviceFormValuesToAddDeviceDto();

    const deviceFilesFormData = new FormData();
    const modelFilesFormData = new FormData();

    this.selectedDeviceFiles.forEach(file => {
      deviceFilesFormData.append('files', file);
    });

    this.selectedModelFiles.forEach(file => {
      modelFilesFormData.append('files', file);
    });

    if (this.selectedRelatedModelsNames.length > 0) {
      this.selectedRelatedModelsNames.forEach(x => {
        this.cooperatedModelsIds.push(x.id);
      });
      newEditedAddDeviceDto.Model.CooperatedModelsIds = this.cooperatedModelsIds;
    }

    if (this.hasFormChanged(newEditedAddDeviceDto)) {
      alert('Aby dokonać edycji urządzenia, wprowadzone dane muszą się różnić.');
      return;
    }

    this.markFormGroupTouched(this.deviceForm);
    if (this.deviceForm.valid) {
      this.apiService.editDevice(this.deviceToEdit.deviceId, this.deviceToBeEditedDto, newEditedAddDeviceDto, this.relateModelsIdsToBeRemoved).pipe(
        switchMap((x: any) => {
          debugger;
          const observables = [];
          if (this.selectedDeviceFiles.length > 0) {
            deviceFilesFormData.append('deviceId', x.deviceId.toString());
            deviceFilesFormData.append('modelId', '');
            observables.push(this.apiService.addDocuments(deviceFilesFormData).pipe(catchError(error => of(error))));
          }
          if (this.selectedModelFiles.length > 0) {
            modelFilesFormData.append('deviceId', '');
            modelFilesFormData.append('modelId', x.modelId.toString());
            observables.push(this.apiService.addDocuments(modelFilesFormData).pipe(catchError(error => of(error))));
          }
          debugger;
          if (this.deviceDocumentsIdsToBeRemoved.length > 0) {
            observables.push(this.apiService.removeDocuments(this.deviceDocumentsIdsToBeRemoved).pipe(catchError(error => of(error))));
          }
          if (this.modelDocumentsIdsToBeRemoved.length > 0) {
            observables.push(this.apiService.removeDocuments(this.modelDocumentsIdsToBeRemoved).pipe(catchError(error => of(error))));
          }
          return forkJoin(observables).pipe(
            map(() => x)
          );
        })
      ).subscribe((x) => {
        alert(`Urządzenie o id: ${x.identificationNumber} zostało dodane`);
        this.deviceForm.reset();
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  markFormGroupTouched(control: AbstractControl) {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        const subControl = control.controls[key];
        this.markFormGroupTouched(subControl);
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach(subControl => this.markFormGroupTouched(subControl));
    } else if (control instanceof FormControl) {
      control.markAsTouched();
    }
  }

  compareDevices(device1: AddDeviceDto, device2: AddDeviceDto): boolean {
    // Call the recursive object comparison function
    return this.compareObjects(device1, device2);
}

  compareObjects(obj1: any, obj2: any): boolean {
    // If both objects are identical, return true
    if (obj1 === obj2) return true;

    // If either is null or undefined and not the same, return false
    if (!obj1 || !obj2) return false;

    // If they are of different types, return false
    if (typeof obj1 !== typeof obj2) return false;

    // Handle arrays: compare element by element
    if (Array.isArray(obj1)) {
        if (!Array.isArray(obj2)) return false;
        if (obj1.length !== obj2.length) return false;
        for (let i = 0; i < obj1.length; i++) {
            if (!this.compareObjects(obj1[i], obj2[i])) return false;
        }
        return true;
    }

    // For objects: compare keys and their values recursively
    if (typeof obj1 === 'object') {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Check if both objects have the same number of properties
        if (keys1.length !== keys2.length) return false;

        // Recursively compare each property
        for (const key of keys1) {
            if (!this.compareObjects(obj1[key], obj2[key])) return false;
        }
        return true;
    }

    // For primitive values (string, number, boolean), compare directly
    return obj1 === obj2;
}

  private mapDeviceFormValuesToAddDeviceDto(): AddDeviceDto {
    let addDeviceDto = new AddDeviceDto();
    addDeviceDto.IdentificationNumber = this.getValueFromDeviceForm('identificationNumber');
    addDeviceDto.ProductionDate = new Date(this.getValueFromDeviceForm('productionDate'));
    addDeviceDto.CalibrationPeriodInYears = this.getValueFromDeviceForm('calibrationPeriodInYears');
    addDeviceDto.LastCalibrationDate = new Date(this.getValueFromDeviceForm('lastCalibrationDate'));
    addDeviceDto.IsCalibrated = this.getValueFromDeviceForm('isCalibrated');
    addDeviceDto.IsCalibrationCloseToExpire = this.getValueFromDeviceForm('isCalibrationCloseToExpire');
    addDeviceDto.StorageLocation = this.getValueFromDeviceForm('storageLocation');
    addDeviceDto.Model = this.getModelFromDeviceForm();

    return addDeviceDto;
  }

  private getModelFromDeviceForm(): ModelDto {
    let modelDto = new ModelDto();
    modelDto.Name = this.getValueFromDeviceForm('model.name');
    modelDto.SerialNumber = this.getValueFromDeviceForm('model.serialNumber')
    modelDto.CompanyName = this.getValueFromDeviceForm('model.companyName');
    modelDto.CooperatedModelsIds = [];
    modelDto.MeasuredValues = this.getMeasuredValuesFromDeviceForm();

    return modelDto;
  }

  private getMeasuredValuesFromDeviceForm(): any {
    let measuredValues = this.deviceForm.get('model.measuredValues') as FormArray;
    let measuredValuesDto: MeasuredValueDto[] = [];

    if(measuredValues.length === 0) {
      return null;
    }

    measuredValues.controls.forEach(x => {
      let measuredValueDto = new MeasuredValueDto();
      measuredValueDto.PhysicalMagnitudeName = x.get('physicalMagnitudeName')?.value;
      measuredValueDto.PhysicalMagnitudeUnit = x.get('physicalMagnitudeUnit')?.value;
      measuredValueDto.MeasuredRanges = this.getMeasuredRangesFromDeviceForm(x);
      measuredValuesDto.push(measuredValueDto);
    });

    return measuredValuesDto;
  }

  private getMeasuredRangesFromDeviceForm(measuredValue: AbstractControl): any {
    let measuredRangesDto: MeasuredRangesDto[] = [];

    let measuredRanges = measuredValue.get('ranges') as FormArray;

    if(!measuredRanges.value) {
      return null;
    }

    measuredRanges.controls.forEach(x => {
      let measuredRangeDto = new MeasuredRangesDto();
      measuredRangeDto.AccuracyInPercent = +x.get('accuracyInPercent')?.value;
      measuredRangeDto.Range = x.get('range')?.value;
      measuredRangesDto.push(measuredRangeDto);
    });

    return measuredRangesDto;
  }

  private getValueFromDeviceForm(name: string): any {
    return this.deviceForm.get(name)?.value ? this.deviceForm.get(name)?.value : null;
  }

  ngAfterViewInit(): void {
    this.getDevices();
    this.deviceToBeEditedDto = this.mapDeviceFormValuesToAddDeviceDto();
  }
  get measuredValuesControls() {
    return (this.deviceForm.get('model.measuredValues') as FormArray).controls;
  }

  onCheckboxChange(name: string, id: number, tableName: string, event: MatCheckboxChange) {
    this.checkedMap[name] = event.checked;
    // Update selected names array based on checked state
    if (this.checkedMap[name]) {
      this.addSelectedCheckboxValue(tableName, id);

    } else {
      this.removeSelectedCheckboxValue(tableName, id);
      console.log('lelum');
    }
    // Optional: Do something when checkbox state changes, if needed
    console.log('selectedCooperationsToRemove:')
    console.log(this.relateModelsIdsToBeRemoved)
  }

  private addSelectedCheckboxValue(tableName: string, value: number) {
    if (tableName === TableName.relatedModels) {
      this.relateModelsIdsToBeRemoved.push(value);
    } else if (tableName === TableName.editedDeviceDocuments) {
      this.deviceDocumentsIdsToBeRemoved.push(value);
    } else if( tableName === TableName.editedModelDocuments) {
      this.modelDocumentsIdsToBeRemoved.push(value);
    }
  }

  private removeSelectedCheckboxValue(tableName: string, value: number) {
    if (tableName === TableName.relatedModels) {
      this.relateModelsIdsToBeRemoved = this.relateModelsIdsToBeRemoved.filter(n => n !== value);
    } else if (tableName === TableName.editedDeviceDocuments) {
      this.deviceDocumentsIdsToBeRemoved = this.deviceDocumentsIdsToBeRemoved.filter(n => n !== value);
    } else if( tableName === TableName.editedModelDocuments) {
      this.modelDocumentsIdsToBeRemoved = this.modelDocumentsIdsToBeRemoved.filter(n => n !== value);
    }
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
  onSelectionChange() {
    console.log(this.selectedRelatedModelsNames);
  }

  onDeviceFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedDeviceFiles = Array.from(event.target.files);
    }
  }

  onModelFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedModelFiles = Array.from(event.target.files);
    }
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
    debugger;
    const selectedDevice = $event.item;
    let deviceSelected = this.devices.find(x => x.modelName === selectedDevice);

    console.log("selected:")
    console.log(deviceSelected);

    var modelMeasuredValues = deviceSelected.measuredValues;
    this.initializeMeasuredValues(modelMeasuredValues);

    this.deviceForm.patchValue({
      model: {
        serialNumber: deviceSelected.modelSerialNumber,
        companyName: deviceSelected.producer
      }
    });
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
    console.log(this.measuredValueRanges(rangeIndex));
    this.measuredValueRanges(rangeIndex).push(this.addNewRangeFG());
  }

  addMeasuredValue() : void {
    this.measuredValues.push(this.addNewMeasuredValueFG());
  }

  private addNewRangeFG(): FormGroup {
    return this.fb.group({
      range:'',
      accuracyInPercent:''
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
