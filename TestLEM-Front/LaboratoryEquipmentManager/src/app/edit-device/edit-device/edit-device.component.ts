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
  selectedRelatedModelsNames: any[] = [];
  relateModelsNamesToEdit: any[] = [];
  relateModelsNamesToEditSelected: string[] = [];
  editedDeviceDocumentsNames: any[] = [];
  editedDeviceDocumentsNamesSelected: any[] = [];
  editedModelDocumentsNames: any[] = [];
  editedModelDocumentsNamesSelected: any[] = [];
  checkedMap: {[key: string]: boolean} = {};
  selectedDeviceFiles: File[] = [];
  anyRelatedDevices: boolean = false;
  anyDeviceDocuments: boolean = false;
  anyModelDocuments: boolean = false;
  selectedModelFiles: File[] = [];
  cooperatedModelsIds: number[] = [];




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
  }

  private setOptionalAreasVisibility() {
    debugger;
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
      this.relateModelsNamesToEdit.push(x);
    })
  }

  initializeEditedDeviceDocuments(documents: any) {
    if (documents === null) {
      return;
    }
    documents.forEach((x: any) => {
      this.editedDeviceDocumentsNames.push(x.name)
    })
  }

  initializeEditedModelDocuments(documents: any) {
    if (documents === null) {
      return;
    }
    documents.forEach((x: any) => {
      this.editedModelDocumentsNames.push(x.name)
    })
  }

  initializeMeasuredValues(measuredValues: any[]) {
    const measuredValuesArray = this.deviceForm.get('model.measuredValues') as FormArray;
    if (measuredValues === null) {
      return;
    }

    measuredValues.forEach(x => {
      const rangesArray = this.fb.array([] as FormGroup[]);
      x.measuredRanges.forEach((y: any) => {
        rangesArray.push(this.fb.group({
          accuracyInPercent: [y.accuracyInPercent],
          range: [y.range]
        }));
      });

      const physicalMagnitudeFG = this.fb.group({
        physicalMagnitudeName: [x.physicalMagnitudeName],
        physicalMagnitudeUnit: [x.physicalMagnitudeUnit],
        ranges: rangesArray
      });

      measuredValuesArray.push(physicalMagnitudeFG);
    });
  }

  onSubmit() {
    console.log(this.selectedRelatedModelsNames);
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

    this.markFormGroupTouched(this.deviceForm);

    if (this.deviceForm.valid) {
      this.apiService.createDevice(newEditedAddDeviceDto).pipe(
        switchMap((x: any) => {
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
      measuredRangeDto.AccuracyInPercent = +x.get('accuracy')?.value;
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
  }
  get measuredValuesControls() {
    return (this.deviceForm.get('model.measuredValues') as FormArray).controls;
  }

  onCheckboxChange(name: string, tableName: string, event: MatCheckboxChange) {
    this.checkedMap[name] = event.checked;
    // Update selected names array based on checked state
    if (this.checkedMap[name]) {
      this.addSelectedCheckboxValue(tableName, name);

    } else {
      this.removeSelectedCheckboxValue(tableName, name);
    }
    // Optional: Do something when checkbox state changes, if needed
    console.log(name, 'checked:', this.checkedMap[name]);
    console.log('Selected names:', this.relateModelsNamesToEditSelected);
    console.log('Selected deviceDocs:', this.editedDeviceDocumentsNames);
  }

  private addSelectedCheckboxValue(tableName: string, value: string) {
    if (tableName === TableName.relatedModels) {
      this.relateModelsNamesToEditSelected.push(value);
    } else if (tableName === TableName.editedDeviceDocuments) {
      this.editedDeviceDocumentsNamesSelected.push(value);
    } else if( tableName === TableName.editedModelDocuments) {
      this.editedModelDocumentsNamesSelected.push(value);
    }
  }

  private removeSelectedCheckboxValue(tableName: string, value: string) {
    if (tableName === TableName.relatedModels) {
      this.relateModelsNamesToEditSelected = this.relateModelsNamesToEditSelected.filter(n => n !== value);
    } else if (tableName === TableName.editedDeviceDocuments) {
      this.editedDeviceDocumentsNamesSelected = this.editedDeviceDocumentsNamesSelected.filter(n => n !== value);
    } else if( tableName === TableName.editedModelDocuments) {
      this.editedModelDocumentsNamesSelected = this.editedModelDocumentsNamesSelected.filter(n => n !== value);
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
    debugger;
    if (event.target.files.length > 0) {
      this.selectedDeviceFiles = Array.from(event.target.files);
    }
  }

  onModelFileChange(event: any) {
    debugger;
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
