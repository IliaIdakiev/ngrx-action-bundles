import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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

  dispatchedActions: { type: 1 | 2 | 3 | 4; action: any }[] = [];

  constructor(private model: Model) {
    this.subscriptions.add(
      combineLatest([
        merge(
          this.model.actions.listen.loadUsersWithNoTimestamp$.pipe(map(() => true)),
          this.model.actions.listen.loadUsersWithNoTimestampSuccess$.pipe(map(() => false)),
          this.model.actions.listen.loadUsersWithNoTimestampFailure$.pipe(map(() => false)),
        ),
        merge(
          this.model.actions.listen.loadUsersWithDefaultTimestamp$.pipe(map(() => true)),
          this.model.actions.listen.loadUsersWithDefaultTimestampSuccess$.pipe(map(() => false)),
          this.model.actions.listen.loadUsersWithDefaultTimestampFailure$.pipe(map(() => false)),
        ),
        merge(
          this.model.actions.listen.loadUsersWithCustomTimestamp$.pipe(map(() => true)),
          this.model.actions.listen.loadUsersWithCustomTimestampSuccess$.pipe(map(() => false)),
          this.model.actions.listen.loadUsersWithCustomTimestampFailure$.pipe(map(() => false)),
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
    this.model.actions.dispatch.itemClear();
  }

  reloadUsers(type: 1 | 2 | 3 | 4): void {
    if (type === 1) {
      const action = this.model.actions.dispatch.loadUsersWithNoTimestamp();
      this.dispatchedActions.push({ type, action })
      console.log('loadUsersWithNoTimestamp action is:', action);
      return;
    }
    if (type === 2) {
      const action = this.model.actions.dispatch.loadUsersWithDefaultTimestamp();
      action.payload.timestamp // not ok
      this.dispatchedActions.push({ type, action })
      console.log('loadUsersWithNoTimestamp action is:', action);
      return;
    }
    if (type === 3) {
      const action = this.model.actions.dispatch.loadUsersWithDefaultTimestamp({ timestamp: 213 });
      action.payload.timestamp // not ok
      this.dispatchedActions.push({ type, action })
      console.log('loadUsersWithDefaultTimestamp action is:', action);
      return;
    }
    if (type === 4) {
      const action = this.model.actions.dispatch.loadUsersWithCustomTimestamp({ timestamp: Math.random().toString() });
      action.payload.timestamp // not ok
      this.dispatchedActions.push({ type, action })
      console.log('loadUsersWithCustomTimestamp action is:', action);
      return;
    }
  }

  cancelActions(): void {
    this.dispatchedActions.forEach(({ type, action }) => {
      if (type === 1) {
        this.model.actions.dispatch.loadUsersWithNoTimestampCancel();
        return;
      }
      if (type === 2) {
        this.model.actions.dispatch.loadUsersWithDefaultTimestampCancel({ timestamp: action.payload.timestamp });
        return;
      }
      if (type === 3) {
        this.model.actions.dispatch.loadUsersWithDefaultTimestampCancel({ timestamp: 213 });
        return;
      }
      if (type === 4) {
        this.model.actions.dispatch.loadUsersWithCustomTimestampCancel({ timestamp: action.payload.timestap });
        return;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isLoading) { this.model.actions.dispatch.loadUsersWithNoTimestampCancel(); }
    this.model.actions.dispatch.loadUsersWithNoTimestampCancel();
    this.subscriptions.unsubscribe();
  }
}
