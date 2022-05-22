import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';
import {MatDialog} from "@angular/material/dialog";
import {ReservationDetailComponent} from "../reservation-detail/reservation-detail.component";
import {Reservation} from "../dto/reservation";
import {Observable, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  allReservations: Reservation[] = [];
  reservations: Reservation[] = [];


  constructor(private reservationService: ReservationService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations(): void {
    this.reservationService.getReservations()
      .subscribe((reservations) => {
        this.allReservations = reservations;
        this.reservations = reservations;
      });
  }

  fnDetail(id: number, isAddMode: boolean): void {
    const dialogRef  = this.dialog.open(ReservationDetailComponent, {
      width: '100%',
      height: '100%',
      data: {
        id: id,
        isAddMode: isAddMode
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined) {
        if(result.event == 'save') {
          this.getReservations();
        }
      }
    });

  }

  search(term: string, searchType: string): void {

    let filteredList:Reservation[] = []
    if (this.allReservations.length > 0) {
      term = term.toLowerCase();
      this.allReservations.forEach(reservation => {
        if(searchType == 'name') {
          if(reservation.firstName.toString().toLowerCase().indexOf(term) > -1
            || reservation.lastName.toString().toLowerCase().indexOf(term) > -1) {
            filteredList.push(reservation);
          }
        } else if(searchType == 'email') {
          if(reservation.email.toString().toLowerCase().indexOf(term) > -1) {
            filteredList.push(reservation);
          }
        }
      });
    }

    this.reservations = filteredList;
  }

  add(): void {
    let newId = this.allReservations.length + 1
    this.fnDetail(newId, true);
  }

}
