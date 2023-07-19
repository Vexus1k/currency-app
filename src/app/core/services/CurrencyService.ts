import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { IHistoryRequest } from "../interfaces/IHistoryRequest";
import { IUsernameAndCurrency } from "../interfaces/IUsernameAndCurrency";

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly _basePath = 'http://localhost:8080/currencies'

  constructor(
    private readonly _http: HttpClient
  ) { }

  public fetchExchangeRate(usernameAndCurrency: IUsernameAndCurrency): Observable<{value: number}> {
    const requestData = {
      currency: usernameAndCurrency.currencyCode,
      name: usernameAndCurrency.username
    };

    return this._http.post<{value: number}>(`${this._basePath}/get-current-currency-value-command`, requestData);
  }

  public getHistoryRequestsOfUser(): Observable<IHistoryRequest[]> {
    return this._http.get<IHistoryRequest[]>(`${this._basePath}/requests`);
  }
}
