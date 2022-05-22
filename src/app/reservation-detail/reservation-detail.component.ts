import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ReservationService } from '../reservation.service';
import { Component, OnInit, Optional, Inject, ElementRef, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Reservation} from "../dto/reservation";



import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from "@angular/forms";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: [ './reservation-detail.component.css' ]
})
export class ReservationDetailComponent implements OnInit {
  reservation: Reservation | undefined;

  id: number;
  isAddMode = false;
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  tags: string[] = [];


  myControl = new FormControl();
  options: string[] = [
    'Alabama'
    ,'Alaska'
    ,'Arizona'
    ,'Arkansas'
    ,'California'
    ,'Colorado'
    ,'Connecticut'
    ,'Delaware'
    ,'Florida'
    ,'Georgia'
    ,'Hawaii'
    ,'Idaho'
    ,'Illinois'
    ,'Indiana'
    ,'Iowa'
    ,'Kansas'
    ,'Kentucky'
    ,'Louisiana'
    ,'Maine'
    ,'Maryland'
    ,'Massachusetts'
    ,'Michigan'
    ,'Minnesota'
    ,'Mississippi'
    ,'Missouri'
    ,'Montana'
    ,'Nebraska'
    ,'Nevada'
    ,'New Hampshire'
    ,'New Jersey'
    ,'New Mexico'
    ,'New York'
    ,'North Carolina'
    ,'North Dakota'
    ,'Ohio'
    ,'Oklahoma'
    ,'Oregon'
    ,'Pennsylvania'
    ,'Rhode Island'
    ,'South Carolina'
    ,'South Dakota'
    ,'Tennessee'
    ,'Texas'
    ,'Utah'
    ,'Vermont'
    ,'Virginia'
    ,'Washington'
    ,'West Virginia'
    ,'Wisconsin'
    ,'Wyoming'

  ];
  filteredOptions: Observable<string[]>;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private location: Location,
    public dialogRef: MatDialogRef<ReservationDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.isAddMode = data.isAddMode;


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    if(this.isAddMode) { // insert
      let newReservation: Reservation = new Reservation();
      newReservation.id = this.id;

      this.reservation = newReservation;
      this.tags = this.reservation.tags;
    } else { // update
      this.getReservation();
    }


  }

  getReservation(): void {
    //const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.reservationService.getReservation(this.id)
      .subscribe((reservation) => {
        this.reservation = reservation;

        this.tags = this.reservation.tags;

      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.reservation) {
      if(this.isAddMode) {
        this.reservationService.addReservation(this.reservation)
          .subscribe(() => {
            this.dialogRef.close({ event: 'save' });
          });
      } else {
        this.reservationService.updateReservation(this.reservation)
          .subscribe(() => {
            this.dialogRef.close({ event: 'save' });
          });
      }
    }
  }


  deleteReservation(reservation: Reservation): void {
    this.reservationService.deleteReservation(reservation.id).subscribe(() => {
      this.dialogRef.close({ event: 'save' });
    });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close' });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

}
