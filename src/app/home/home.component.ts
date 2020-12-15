import { Component, OnDestroy, OnInit } from '@angular/core';
import { Connect } from 'ngrx-action-bundles';
import { loadUsersBundle, itemBundle } from '../+store/bundles';
import { selectMainUserList, selectMainItem } from '../+store/selectors';
import { merge, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();

  actions = this.connect.connectBundles([
    loadUsersBundle,
    itemBundle
  ]);

  selectors = this.connect.connectSelectors({
    userList: selectMainItem,
    item: selectMainUserList
  });

  users$ = this.selectors.userList$;
  item$ = this.selectors.item$;

  isLoading = false;

  constructor(private connect: Connect) {
    this.subscriptions.add(
      merge<any, boolean>(
        this.actions.listen.loadUsers$.pipe(mapTo(true)),
        this.actions.listen.loadUsersSuccess$.pipe(mapTo(false)),
        this.actions.listen.loadUsersFailure$.pipe(mapTo(false)),
      ).subscribe(isLoading => this.isLoading = isLoading)
    );
  }

  ngOnInit(): void {
    this.actions.dispatch.loadUsers();

    this.subscriptions.add(
      this.actions.listen.loadUsersSuccess$.subscribe(console.log)
    );
    this.subscriptions.add(
      this.actions.listen.loadUsersCancel$.subscribe(console.log)
    );
    this.subscriptions.add(
      this.actions.listen.loadUsersClear$.subscribe(console.log)
    );
  }


  ngOnDestroy(): void {
    if (this.isLoading) { this.actions.dispatch.loadUsersCancel(); }
    this.actions.dispatch.loadUsersClear();
    this.subscriptions.unsubscribe();
  }
}
