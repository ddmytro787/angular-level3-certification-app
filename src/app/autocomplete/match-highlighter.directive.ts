import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({ selector: '[matchHighlighter]' })
export class MatchHighlighterDirective implements OnChanges {
  element!: HTMLElement;
  @Input() matchHighlighter: { value: string; input: string; } = { value: '', input: '' };

  constructor(private elRef: ElementRef) {
    this.element = this.elRef.nativeElement;
  }

  ngOnChanges() {
    this._highlightMatches();
  }

  private _highlightMatches() {
    let value = this.matchHighlighter.value;
    const input = this.matchHighlighter.input;
    const matchRegex = new RegExp(input, 'gi');
    let replaceRegex: RegExp;
    const matches = new Set(value.match(matchRegex)?.reverse());

    matches.forEach(match => {
      replaceRegex = new RegExp(match, 'g');
      value = value.replace(replaceRegex, `<strong>${match}</strong>`);
    });

    return this.element.innerHTML = value;
  }
}
