import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, Form, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AddDeviceDto, ApiServiceService, DeviceDto, MeasuredRangesDto, MeasuredValueDto, ModelDto, PagedAndSortedQueryOfDevicesList } from '../api-service.service';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit, AfterViewInit {
  deviceForm: FormGroup;
  selectedFile: File;
  submitted = false;
  fieldRequired = 'Pole jest wymagane';
  selectedDeviceFiles: File[] = [];
  deviceQuery = new PagedAndSortedQueryOfDevicesList();
  devices: any[] = [];
  devicesNames: string[] = [];
  states: string[] = [
  'Alabama',
	'Alaska',
	'American Samoa',
	'Arizona',
	'Arkansas',
	'California',
	'Colorado',
	'Connecticut'
  ];

  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiServiceService, private service: ApiServiceService) {
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
  ngAfterViewInit(): void {
    this.getDevices();
    console.log(this.devices);
   }

  ngOnInit(): void {
    // this.getDevices();
    // console.log(this.devices);
  }


	search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) =>
				term.length < 2 ? [] : this.devicesNames.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
	);

  getDevices() {
    this.service.getDevices(this.deviceQuery).subscribe((x: any) => {
      console.log(x);
      this.devices = x.items;
      for(let device of this.devices){
        this.devicesNames.push(device.modelName);
      }
      console.log(x.items);
    });
  }

  onDeviceSelect($event: NgbTypeaheadSelectItemEvent){
    const selectedDevice = $event.item;
    console.log("selectedDeviceName: "+selectedDevice);
    console.log("devices: "+this.devices);
    let deviceSelected = this.devices.find(x => x.modelName === selectedDevice);
    console.log("ideviceIdentificationNumber: "+deviceSelected.modelSerialNumber);
    this.deviceForm.patchValue({
      model: {
        serialNumber: deviceSelected.modelSerialNumber
      }
    });
  }

  //dodać walidację
  //dać measured ranges na nullable w BE +
  //ogarnać duplikaty firm
  //dodać urządzenia powiązane
  //ogarnać dokumenty


  get measuredValues() {
    return this.deviceForm.get('model.measuredValues') as FormArray;
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

  onDeviceFileChange(event: any) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      this.selectedDeviceFiles = Array.from(files);
    }
  }


  onSubmit() {
    this.submitted = true;
    if (this.deviceForm.invalid) {
      return;
    }

    //zrobić strzał do innego endpointa, do zapisywania doksów?

    let addDeviceDto = this.mapDeviceFormValuesToAddDeviceDto();

    // if(this.selectedDeviceFiles.length > 0){
    //   this.deviceForm.controls['documents'].setValue(this.selectedDeviceFiles);
    // }
    let formData = new FormData();
    for(const [key, value] of Object.entries(this.deviceForm.value)){
      if(typeof value != "object"){
        formData.append(key, String(value));
      }
    }

    console.log(this.deviceForm);
    console.log(formData);
    this.markFormGroupTouched(this.deviceForm);
    if (this.deviceForm.valid){
      this.apiService.createDevice(addDeviceDto).subscribe((x: string) => {
        alert(`Urządzenie o id: ${x} zostało dodane`);
        this.deviceForm.reset();
        window.scroll({
          top: 0,
          behavior: 'smooth'
        })
      });
    }

    // debugger;
    // const addDeviceDto = this.mapDeviceFormValuesToAddDeviceDto();
    // const formData = new FormData();
    // let formJson = JSON.stringify(addDeviceDto);

    // formData.append('addDeviceDto', formJson);
    // this.selectedDeviceFiles.forEach(file => formData.append('documents', file, file.name));

    // console.log(formData);
    // console.log(addDeviceDto);

    // this.apiService.createDevice(formData).subscribe(response => {
    //   alert(`Urządzenie o id: ${response} zostało dodane`);
    //   this.deviceForm.reset();
    //   window.scroll({ top: 0, behavior: 'smooth' });
    // });
  }

  // displayFGvalues() {
  //   let addDeviceDto = this.mapDeviceFormValuesToAddDeviceDto();
  //   this.markFormGroupTouched(this.deviceForm);
  //   if (this.deviceForm.valid){
  //     this.apiService.createDevice(addDeviceDto).subscribe((x: string) => {
  //       alert(`Urządzenie o id: ${x} zostało dodane`);
  //       this.deviceForm.reset();
  //       window.scroll({
  //         top: 0,
  //         behavior: 'smooth'
  //       })
  //     });
  //   }
  // }

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

  navigateToDevicesList(): void {
    this.router.navigate(['']);
  }

  shouldShowError(controlName: string): boolean {
    const control = this.deviceForm.get(controlName);
    return control!.invalid && (control!.touched || this.submitted);
  }

  shouldShowErrorById(id: string): boolean {
    const control = document.getElementById(id) as any;
    return !control.validity.valid;
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

  private mapDeviceFormValuesToAddDeviceDto(): AddDeviceDto {
    let addDeviceDto = new AddDeviceDto();
    addDeviceDto.IdentifiactionNumber = this.getValueFromDeviceForm('identificationNumber');
    addDeviceDto.ProductionDate = new Date(this.getValueFromDeviceForm('productionDate'));
    addDeviceDto.CalibrationPeriodInYears = this.getValueFromDeviceForm('calibrationPeriodInYears');
    addDeviceDto.LastCalibrationDate = new Date(this.getValueFromDeviceForm('lastCalibrationDate'));
    addDeviceDto.IsCalibrated = this.getValueFromDeviceForm('isCalibrated');
    addDeviceDto.IsCalibrationCloseToExpire = this.getValueFromDeviceForm('isCalibrationCloseToExpire');
    addDeviceDto.StorageLocation = this.getValueFromDeviceForm('storageLocation');
    addDeviceDto.Documents = this.selectedDeviceFiles;
    addDeviceDto.Model = this.getModelFromDeviceForm();

    return addDeviceDto;
  }

  private getValueFromDeviceForm(name: string): any {
    return this.deviceForm.get(name)?.value ? this.deviceForm.get(name)?.value : null;
  }

  private getModelForm() : FormGroup {
    return this.deviceForm.get('model') as FormGroup;
  }

  private getDeviceDocuments(){
    const formData = new FormData();

    this.selectedDeviceFiles.forEach(file => {
      formData.append('documents', file, file.name);
    });
    return formData;
  }

  private getModelFromDeviceForm(): ModelDto {
    let modelDto = new ModelDto();
    modelDto.Name = this.getValueFromDeviceForm('model.name');
    modelDto.SerialNumber = this.getValueFromDeviceForm('model.serialNumber')
    modelDto.CompanyName = this.getValueFromDeviceForm('model.companyName');
    modelDto.Documents = this.getValueFromDeviceForm('model.documents');
    modelDto.CooperatedModelsIds = this.getValueFromDeviceForm('model.cooperatedModelsIds');
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
}
