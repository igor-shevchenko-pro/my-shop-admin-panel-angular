import { Injectable } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  public fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  public toModel(date: NgbDateStruct | null): string | null {
    if(date != null){
      if(date.month.toString().length > 1){
        return date.day + this.DELIMITER + date.month + this.DELIMITER + date.year;
      }else{
        return date.day + this.DELIMITER + '0'+date.month + this.DELIMITER + date.year;
      }
    }
    else{
      return null;
    }
  }
}