import { Component, OnDestroy, OnInit } from '@angular/core';
import { Connect } from 'ngrx-action-bundles';
import { combineLatest, merge, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Model } from '../+store/model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();

  loadTimestamp: number | undefined;

  isLoading = false;

  users$ = this.model.selectors.userList$;
  item$ = this.model.selectors.item$;

  constructor(private model: Model) {
    this.subscriptions.add(
      combineLatest([
        merge<any, boolean>(
          this.model.actions.listen.loadUsersWithNoTimestamp$.pipe(mapTo(true)),
          this.model.actions.listen.loadUsersWithNoTimestampSuccess$.pipe(mapTo(false)),
          this.model.actions.listen.loadUsersWithNoTimestampFailure$.pipe(mapTo(false)),
        ),
        merge<any, boolean>(
          this.model.actions.listen.loadUsersWithDefaultTimestamp$.pipe(mapTo(true)),
          this.model.actions.listen.loadUsersWithDefaultTimestampSuccess$.pipe(mapTo(false)),
          this.model.actions.listen.loadUsersWithDefaultTimestampFailure$.pipe(mapTo(false)),
        ),
        merge<any, boolean>(
          this.model.actions.listen.loadUsersWithCustomTimestamp$.pipe(mapTo(true)),
          this.model.actions.listen.loadUsersWithCustomTimestampSuccess$.pipe(mapTo(false)),
          this.model.actions.listen.loadUsersWithCustomTimestampFailure$.pipe(mapTo(false)),
        ),
      ]).subscribe(isLoadingArray => this.isLoading = isLoadingArray.includes(true))
    );
  }

  ngOnInit(): void {
    const dispatchedAction = this.model.actions.dispatch.loadUsersWithNoTimestamp();
    console.log('ngOnInit action is:', dispatchedAction);

    this.subscriptions.add(
      this.model.actions.listen.loadUsersWithNoTimestampSuccess$.subscribe(console.log)
    );
    this.subscriptions.add(
      this.model.actions.listen.loadUsersWithNoTimestampCancel$.subscribe(console.log)
    );
    this.subscriptions.add(
      this.model.actions.listen.loadUsersWithNoTimestampClear$.subscribe(console.log)
    );
  }

  setItem(data: { item: string }) {
    this.model.actions.dispatch.setItem(data);
  }

  clearItem() {
    this.model.actions.dispatch.clearItem();
  }

  reloadUsers(type: 1 | 2 | 3): void {
    if (type === 1) {
      const action = this.model.actions.dispatch.loadUsersWithNoTimestamp();
      console.log('loadUsersWithNoTimestamp action is:', action);
      return;
    }
    if (type === 2) {
      const action = this.model.actions.dispatch.loadUsersWithDefaultTimestamp();
      console.log('loadUsersWithDefaultTimestamp action is:', action);
      return;
    }
    if (type === 3) {
      const action = this.model.actions.dispatch.loadUsersWithCustomTimestamp({ timestamp: Math.random().toString() });
      console.log('loadUsersWithCustomTimestamp action is:', action);
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.isLoading) { this.model.actions.dispatch.loadUsersWithNoTimestampCancel(); }
    this.model.actions.dispatch.loadUsersWithNoTimestampCancel();
    this.subscriptions.unsubscribe();
  }
}
