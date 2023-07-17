import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutocompleteItem } from '../data.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl<string>;
  @Input() placeholder = '';
  @Input() itemsList: AutocompleteItem[] | null = null;
  inputElId = this._generateAutocompleteInputId();
  isInputElFocused!: boolean;
  private _inputElValue = '';
  private _subscription = new Subscription();

  @ViewChild('inputEl', { static: true }) inputElRef!: ElementRef<HTMLInputElement>;

  get itemsListWithEmptyOption(): AutocompleteItem[] {
    return [{ id: '', name: this.placeholder }, ...(this.itemsList || [])];
  }

  ngOnInit() {
    this._listenToResetControlStateAndClearInput();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this.control.reset();
  }

  onChange(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value;
    if(this._compareStringValues(this._inputElValue, value)) return;

    this._inputElValue = value;
    const item = this._findItemByName(this._inputElValue);
    this.control?.setValue(item?.id || this._inputElValue);
  }

  onSelect(event: MouseEvent, item: AutocompleteItem) {
    event.stopPropagation();
    this._inputElValue = item.name;
    this.inputElRef.nativeElement.value = this._inputElValue;
    this.control?.setValue(item.id);
    this.isInputElFocused = false;
  }

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLInputElement) {
    if(target.id === this.inputElId) return;
    this.isInputElFocused = false;
  }

  private _generateAutocompleteInputId() {
    const idBasedOnDate = Date.now().toString();
    return `autocomplete_input_${idBasedOnDate.slice(-4)}`;
  }

  private _findItemByName(value: string) {
    return this.itemsList?.find(item => this._compareStringValues(item.name, value));
  }

  private _listenToResetControlStateAndClearInput() {
    this._subscription.add(
      this.control?.valueChanges.subscribe(val => {
        if(val) return;
        this.inputElRef.nativeElement.value = '';
      }),
    );
  }

  private _compareStringValues(val1: string, val2: string) {
    return val1.toLowerCase() === val2.toLowerCase();
  }
}
