import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { CurrencyService } from "./core/services/CurrencyService";
import { of, throwError } from "rxjs";
import { IHistoryRequest } from "./core/interfaces/IHistoryRequest";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('AppComponent', () => {
  let component: AppComponent;
  let currencyService: CurrencyService;
  let alertSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [AppComponent],
      providers: [CurrencyService]
    });

    currencyService = TestBed.inject(CurrencyService);
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    alertSpy = spyOn(window, 'alert');
  });

  it('should handle error on fetching exchange rate for invalid currency (error 400)', fakeAsync(() => {
    const mockError = { status: 400 };

    const mockUsernameAndCurrency = { username: 'JohnDoe', currencyCode: 'INVALID' };

    spyOn(currencyService, 'fetchExchangeRate').and.returnValue(throwError(mockError));

    component.getExchangeRateForCurrency(mockUsernameAndCurrency);

    tick();

    expect(component.loading).toBeFalse();

    expect(alertSpy).toHaveBeenCalledWith('Error: Bad Request - Invalid currency.');
  }));

  it('should handle error on fetching exchange rate', fakeAsync(() => {
    const mockError = { status: 500 };

    const mockUsernameAndCurrency = { username: 'JohnDoe', currencyCode: 'USD' };

    spyOn(currencyService, 'fetchExchangeRate').and.returnValue(throwError(mockError));

    component.getExchangeRateForCurrency(mockUsernameAndCurrency);

    tick();

    expect(component.loading).toBeFalse();

    expect(window.alert).toHaveBeenCalledWith('Error: Something went wrong while getting the exchange rate.');
  }));

  it('should fetch exchange rate for currency and call initHistoryRequests and clearInputs', fakeAsync(() => {
    const mockResponse = { value: 1.2345 };

    const mockUsernameAndCurrency = { username: 'JohnDoe', currencyCode: 'USD' };

    spyOn(currencyService, 'fetchExchangeRate').and.returnValue(of(mockResponse));

    spyOn(component, 'initHistoryRequests');
    spyOn(component, 'clearInputs');

    component.getExchangeRateForCurrency(mockUsernameAndCurrency);

    tick();

    expect(component.loading).toBeFalse();

    expect(component.amount).toEqual(mockResponse.value);
    expect(component.currencyCode).toEqual(mockUsernameAndCurrency.currencyCode);

    expect(component.initHistoryRequests).toHaveBeenCalled();
    expect(component.clearInputs).toHaveBeenCalled();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should clear username and currency on clearInputs()', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.username = 'JohnDoe';
    app.currency = 'USD';

    app.clearInputs();

    expect(app.username).toEqual('');
    expect(app.currency).toEqual('');
  });

  it('should initialize historyRequests correctly', fakeAsync(() => {
    const mockResponse: IHistoryRequest[] = [
      {
        id: 1,
        currency: 'USD',
        name: 'JohnDoe',
        timestamp: '2023-07-19T12:34:56',
        result: 85.75
      },
      {
        id: 2,
        currency: 'EUR',
        name: 'JaneSmith',
        timestamp: '2023-07-18T09:15:30',
        result: 42.25
      },
      {
        id: 3,
        currency: 'GBP',
        name: 'BobJohnson',
        timestamp: '2023-07-17T15:45:10',
        result: 90.30
      }
    ];

    spyOn(currencyService, 'getHistoryRequestsOfUser').and.returnValue(of(mockResponse));

    component.initHistoryRequests();

    tick();

    expect(component.historyRequests).toEqual(mockResponse.reverse());
  }));
});
