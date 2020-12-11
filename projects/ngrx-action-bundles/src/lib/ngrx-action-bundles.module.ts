import { NgModule } from '@angular/core';
import { NgrxActionBundlesComponent } from './ngrx-action-bundles.component';
import { Connect } from './ngrx-action-bundles.service';



@NgModule({
  // declarations: [NgrxActionBundlesComponent],
  // imports: [
  // ],
  // exports: [NgrxActionBundlesComponent]
  providers: [Connect]
})
export class NgrxActionBundlesModule { }
