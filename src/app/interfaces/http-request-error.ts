import { ObjectWithTimestamp } from "ngrx-action-bundles";

export interface IHttpRequestWithCustomTimestampError extends ObjectWithTimestamp<string> {
  error: Error;
}

export interface IHttpRequestWithDefaultTimestampError extends ObjectWithTimestamp {
  error: Error;
}

export interface IHttpRequestWithNoTimestampError {
  error: Error;
}

