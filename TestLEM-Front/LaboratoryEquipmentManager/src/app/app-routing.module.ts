import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { UserComponent } from './user/user.component';
import { EditDeviceComponent } from './edit-device/edit-device/edit-device.component';

const routes: Routes = [
  { path: '', redirectTo: '/devices-list', pathMatch: 'full' },
  { path: 'devices-list', component: DevicesListComponent },
  { path: 'add-device', component: AddDeviceComponent },
  { path: 'edit-device', component: EditDeviceComponent},
  { path: 'user', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
