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

  constructor(private model: Model) {
    this.subscriptions.add(
      combineLatest([
        merge(
          this.model.actions.listen.loadUsers$.pipe(map(() => true)),
          this.model.actions.listen.loadUsersSuccess$.pipe(map(() => false)),
          this.model.actions.listen.loadUsersFailure$.pipe(map(() => false)),
        )
      ]).subscribe(isLoadingArray => this.isLoading = isLoadingArray.includes(true))
    );
  }

  ngOnInit(): void {
    const dispatchedAction = this.model.actions.dispatch.loadUsers();
    console.log('ngOnInit action is:', dispatchedAction);
  }

  setItem(data: { item: string }) {
    this.model.actions.dispatch.setItem(data);
  }

  clearItem() {
    this.model.actions.dispatch.setItemCleanup();
  }

  reloadUsers(): void {
    const action = this.model.actions.dispatch.loadUsers();
    console.log('loadUsers action is:', action);
  }

  cancelActions(): void {
    const action = this.model.actions.dispatch.loadUsersCancel();
    console.log('loadUsers Cancel action is:', action);
  }

  ngOnDestroy(): void {
    if (this.isLoading) { this.model.actions.dispatch.loadUsersCancel(); }
    this.subscriptions.unsubscribe();
  }
}
