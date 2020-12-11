import { Component, OnDestroy, OnInit } from '@angular/core';
import { Connect } from 'ngrx-action-bundles';
import { loadUsers } from '../+store/actions';
import { selectUserList } from '../+store/selectors';
import { merge, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();

  actions = this.connect.connectActionBundles([loadUsers]);
  selectors = this.connect.connectSelectors({ userList: selectUserList });

  users$ = this.selectors.userList$;

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


  loadUsers(): void {
    this.actions.dispatch.loadUsersClear();
    this.actions.dispatch.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.isLoading) { this.actions.dispatch.loadUsersCancel(); }
    this.actions.dispatch.loadUsersClear();
    this.subscriptions.unsubscribe();
  }
}
