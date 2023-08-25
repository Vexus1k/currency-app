import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IHistoryRequest } from "./core/interfaces/IHistoryRequest";
import { ActivatedRoute } from "@angular/router";
import { CurrencyService } from "./core/services/CurrencyService";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { IUsernameAndCurrency } from "./core/interfaces/IUsernameAndCurrency";
import { finalize } from "rxjs";

@Component({
  animations: [
    trigger('fadeInFromRight', [
      transition('* => *', [
        query(':enter', style({opacity: 0, transform: 'translateX(100%)'}), {optional: true}),
        query(':enter', stagger('100ms', [animate('300ms ease-in', style({
          opacity: 1,
          transform: 'translateX(0)'
        }))]), {optional: true}),
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: `./app.component.html`,
})
export class AppComponent implements OnInit {
  public amount: number;
  public currency = '';
  public loading = false;
  public currencyCode = '';
  public username = '';
  public historyRequests: IHistoryRequest[] = [];
  public page = 1;

  public constructor(
    private readonly _route: ActivatedRoute,
    private readonly _currentService: CurrencyService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.initHistoryRequests();
  }

  public getExchangeRateForCurrency(usernameAndCurrency: IUsernameAndCurrency): void {
    this.loading = true;

    this._currentService.fetchExchangeRate(usernameAndCurrency).pipe(finalize(() => {
      this.loading = false;
      this._cdr.detectChanges();
    })).subscribe(
      (res) => {
        this.amount = res['value'];
        this.currencyCode = usernameAndCurrency.currencyCode;
        this.clearInputs();
        this.initHistoryRequests();
      }, error => {
        if (error.status === 400) {
          alert('Error: Bad Request - Invalid currency.');
        } else {
          alert('Error: Something went wrong while getting the exchange rate.');
        }
      }
    );
  }

  public initHistoryRequests(page = 1): void {
    this._currentService.getHistoryRequestsOfUser(page).pipe(finalize(() => {
      this._cdr.detectChanges();
    }) ).subscribe(
      (res) => {
        if (res) {
          this.historyRequests = res.reverse();
        }
      },
      () => {
        alert('Error: Something went wrong while getting requests history.');
        this.page = 1;
      }
    );
  }

  public clearInputs(): void {
    this.username = '';
    this.currency = '';
  }
}
