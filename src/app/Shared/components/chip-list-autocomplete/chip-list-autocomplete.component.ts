import { FormControl } from '@angular/forms';
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-chip-list-autocomplete',
  templateUrl: './chip-list-autocomplete.component.html',
  styleUrls: ['./chip-list-autocomplete.component.scss'],
})
export class ChipListAutocompleteComponent implements OnInit {

  @Input() chipListAutoCompleteFormControl: FormControl;
  @Input() orignalList: string[] = [];
  @Input() fieldLabel: string;
  @Input() errorMessage: string;

  @ViewChild('searchField') searchField: ElementRef<HTMLInputElement>;

  filteredList: string[] = [];
  selectedList: string[] = [];
  inputFormControl: FormControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orignalList?.currentValue) {
      this.filteredList = [...this.orignalList];
    }
  }

  ngOnInit(): void {
    this.inputFormControl.valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((result: any) => {
        this.filteredList = result 
          ? this.filteredList.filter(s => s.toLowerCase().includes(result.toLowerCase())) 
          : this.filteredList.slice();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  addOne(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedList.push(value);
      this.setAddressesFormField();
    }
    event.chipInput!.clear();
    this.inputFormControl.setValue(null);
  }

  removeOne(index: number): void {
    this.selectedList.splice(index, 1);
    this.setAddressesFormField();
  }

  selectOne(event: MatAutocompleteSelectedEvent): void {
    this.selectedList.push(event.option.value);
    this.setAddressesFormField();
    this.searchField.nativeElement.value = '';
    this.inputFormControl.setValue(null);
  }

  private setAddressesFormField(): void {
    this.chipListAutoCompleteFormControl.setValue([...this.selectedList]);
    this.filteredList = this.orignalList.filter(s => !this.selectedList.some(t => t === s));
  }

}
