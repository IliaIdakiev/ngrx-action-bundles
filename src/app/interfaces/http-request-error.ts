import { ObjectWithTimestamp } from "ngrx-action-bundles";

export interface IHttpRequestError extends ObjectWithTimestamp {
  error: Error;
}
