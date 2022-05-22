import {Stay} from './stay';
import {Room} from './room';
import {AddressStreet} from './addressStreet';
import {AddressLocation} from './addressLocation';

export class Reservation {
  stay: Stay = new Stay();
  room: Room = new Room();
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  addressStreet: AddressStreet = new AddressStreet();
  addressLocation: AddressLocation = new AddressLocation();
  extras: string[] = [];
  payment: string = '';
  note: string = '';
  tags: string[] = [];
  reminder: boolean = false;
  newsletter: boolean = false;
  confirm: boolean = false;

  id: number;
}
