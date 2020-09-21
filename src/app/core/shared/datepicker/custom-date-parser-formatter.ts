import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '-';

  public parse(value: string): NgbDateStruct | null {
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

  public format(date: NgbDateStruct | null): string {
    if(date != null){
      if(date.month.toString().length > 1){
        return date.day + this.DELIMITER + date.month + this.DELIMITER + date.year;
      }else{
        return date.day + this.DELIMITER + '0'+date.month + this.DELIMITER + date.year;
      }
    }
    else{
      return '';
    }
  }
}