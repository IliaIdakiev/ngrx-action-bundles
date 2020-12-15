import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { NgrxActionBundlesModule } from 'ngrx-action-bundles';
import { reducers } from './+store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EffectsModule } from '@ngrx/effects';
import { UserListEffects } from './+store/effects';
import { AboutComponent } from './about/about.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    EffectsModule.forRoot([UserListEffects]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument(),
    NgrxActionBundlesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
