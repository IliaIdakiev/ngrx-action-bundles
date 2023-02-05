import { Injectable } from "@angular/core";
import { Connect } from "ngrx-action-bundles";
import { bundles } from './bundles';
import * as selectors from "./selectors";

@Injectable({
  providedIn: 'root'
})
export class Model {

  actions = this.connect.bundles(bundles);
  selectors = this.connect.selectors(selectors);

  constructor(
    private connect: Connect
  ) { }
}
