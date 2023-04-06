import { Injectable } from "@angular/core";
import { connectBundles, connectSelectors } from "ngrx-action-bundles";
import { bundles } from "./bundles";
import * as selectors from "./selectors";

@Injectable({
  providedIn: 'root'
})
export class Model {
  actions = connectBundles(bundles);
  selectors = connectSelectors(selectors);
}
