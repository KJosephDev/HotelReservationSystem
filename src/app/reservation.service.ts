import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Reservation} from "./dto/reservation";


@Injectable({ providedIn: 'root' })
export class ReservationService {

  private reservationsUrl = 'api/reservations';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET reservations from the server */
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.reservationsUrl)
      .pipe(
        tap(_ => {

        }),
        catchError(this.handleError<Reservation[]>('getReservations', []))
      );
  }



  /** GET reservation by id. Will 404 if id not found */
  getReservation(id: number): Observable<Reservation> {
    // @ts-ignore
    return this.getReservations().pipe(
      map(reservations => reservations.find(reservation => reservation.id === id))
    );
  }

  /* GET reservations whose name contains search term */
  searchReservations(term: string): Observable<Reservation[]> {
    if (!term.trim()) {
      // if not search term, return empty reservation array.
      return of([]);
    }
    return this.http.get<Reservation[]>(`${this.reservationsUrl}/?email=${term}`).pipe(
      tap((x) => {
        console.log('found reservations matching');
      }),
      catchError(this.handleError<Reservation[]>('searchReservations', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new reservation to the server */
  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.reservationsUrl, reservation, this.httpOptions).pipe(
      tap((newReservation: Reservation) => {

      }),
      catchError(this.handleError<Reservation>('addReservation'))
    );
  }

  /** DELETE: delete the reservation from the server */
  deleteReservation(id: number): Observable<Reservation> {
    const url = `${this.reservationsUrl}/${id}`;

    return this.http.delete<Reservation>(url, this.httpOptions).pipe(
      tap((_) => {

      }),
      catchError(this.handleError<Reservation>('deleteReservation'))
    );
  }

  /** PUT: update the reservation on the server */
  updateReservation(reservation: Reservation): Observable<any> {
    return this.http.put(this.reservationsUrl, reservation, this.httpOptions).pipe(
      tap((_) => {

      }),
      catchError(this.handleError<any>('updateReservation'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
