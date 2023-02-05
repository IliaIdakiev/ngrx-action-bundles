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

  isLoadingWithoutTimestamp = false;
  isLoadingWithTimestamp = false;

  get isLoading() {
    return this.isLoadingWithTimestamp || this.isLoadingWithoutTimestamp;
  }

  users$ = this.model.selectors.userList$;
  item$ = this.model.selectors.item$;

  constructor(private model: Model) {
    this.subscriptions.add(
      combineLatest([
        merge(
          this.model.actions.listen.loadUsers$.pipe(map(() => true)),
          this.model.actions.listen.loadUsersSuccess$.pipe(map(() => false)),
          this.model.actions.listen.loadUsersFailure$.pipe(map(() => false)),
        )
      ]).subscribe(isLoadingArray => this.isLoadingWithoutTimestamp = isLoadingArray.includes(true))
    );

    this.subscriptions.add(
      combineLatest([
        merge(
          this.model.actions.listen.loadUsersWithTimestamp$.pipe(map(() => true)),
          this.model.actions.listen.loadUsersWithTimestampSuccess$.pipe(map(() => false)),
          this.model.actions.listen.loadUsersWithTimestampFailure$.pipe(map(() => false)),
        )
      ]).subscribe(isLoadingArray => this.isLoadingWithTimestamp = isLoadingArray.includes(true))
    );

    this.subscriptions.add(
      this.model.actions.listen.test$.subscribe((value) => console.log('Test action value is:', value))
    );
  }

  ngOnInit(): void {
    const dispatchedAction = this.model.actions.dispatch.loadUsers();
    console.log('ngOnInit action is:', dispatchedAction);
  }

  setItem(data: { item: string }) {
    this.model.actions.dispatch.setItem(data);
  }

  sendStandardAction(data: { item: string }): void {
    this.model.actions.dispatch.test({ value: data.item });
  }

  clearItem() {
    this.model.actions.dispatch.setItemCleanup();
  }

  reloadUsers(): void {
    this.cancelActions();
    const action = this.model.actions.dispatch.loadUsers();
    console.log('loadUsers action is:', action);
  }

  reloadUsersWithTimestamp(): void {
    this.cancelActions();
    const action = this.model.actions.dispatch.loadUsersWithTimestamp();
    console.log('loadUsersWithTimestamp action is:', action);
  }

  cancelActions(): void {
    const action = this.model.actions.dispatch.loadUsersCancel();
    console.log('loadUsers Cancel action is:', action);
  }

  cancelLoading() {
    if (this.isLoadingWithoutTimestamp) {
      this.model.actions.dispatch.loadUsersCancel();
    }
    if (this.isLoadingWithTimestamp) {
      this.model.actions.dispatch.loadUsersWithTimestampCancel();
    }
  }

  ngOnDestroy(): void {
    this.cancelLoading();
    this.subscriptions.unsubscribe();
  }
}
