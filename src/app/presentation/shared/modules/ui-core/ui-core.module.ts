import { NgModule } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";

import { CommonModule } from "@angular/common";
import { MaterialUiModule } from "../material/material-ui.module";

const uiModules = [
  CommonModule,
  RouterModule,
  RouterLink,
  RouterLinkActive,
  MaterialUiModule
];

@NgModule({
  imports: [
    ...uiModules
  ],
  declarations: [

  ],
  exports: [
    ...uiModules
  ],
  providers: [

  ],
})
export class UiCoreModule { }