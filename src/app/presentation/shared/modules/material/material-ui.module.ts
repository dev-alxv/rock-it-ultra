import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const matModules = [
  FormsModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: [
    ...matModules
  ],
  exports: [
    ...matModules
  ],
  declarations: [],
})
export class MaterialUiModule { }