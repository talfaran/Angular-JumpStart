import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }


  public pickedFromList(control: FormControl) {
    if (!control || !control.value) { return null; }

      if ( typeof control.value === 'string') {
        return { notPickedFromList: true };
      }
    return null;
  }
}
