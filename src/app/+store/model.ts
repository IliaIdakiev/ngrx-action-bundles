import { Injectable } from "@angular/core";
import { Connect } from "ngrx-action-bundles";
import { bundles } from "./bundles";
import { selectors } from "./selectors";

@Injectable({
  providedIn: 'root'
})
export class Model {

  actions = this.connect.connectBundles(bundles);
  selectors = this.connect.connectSelectors(selectors);

  constructor(
    private connect: Connect
  ) { }
}