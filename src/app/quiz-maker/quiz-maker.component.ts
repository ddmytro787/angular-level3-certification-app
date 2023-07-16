import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {
  combineLatestWith,
  map,
  Observable,
  ReplaySubject,
  Subscription,
  tap,
} from 'rxjs';
import {QuizService} from '../quiz.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent implements OnInit, OnDestroy {
  categoryControl = new FormControl<string>('', { validators: [Validators.required], nonNullable: true });
  subCategoryControl = new FormControl<string>('', { nonNullable: true });
  form = new FormGroup({
    category: this.categoryControl,
    subCategory: this.subCategoryControl,
    difficulty: new FormControl<Difficulty | ''>('', { validators: [Validators.required], nonNullable: true }),
  });

  private _categories$ = new ReplaySubject<Category[]>(1);
  private _subCategories$ = new ReplaySubject<Map<string, Category[]>>(1);
  categories$ = this._categories$.asObservable();
  subCategories$!: Observable<Category[] | undefined>;
  questions$!: Observable<Question[]>;

  private _subscriptions = new Subscription();

  constructor(protected quizService: QuizService) {
  }

  ngOnInit() {
    this._getAllCategories();
    this._setSubCategoriesChangeLogicBasedOnCategoryValueChanges();
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  createQuiz(): void {
    const values = this.form.value;
    const categoryId = values.subCategory || values.category || '';
    const difficulty =  values.difficulty || '';

    this.questions$ = this.quizService.createQuiz(categoryId, difficulty as Difficulty);
  }

  private _getAllCategories() {
    this._subscriptions.add(
      this.quizService.getAllCategories().pipe(
        tap(_categories => {
          const categories = this.quizService.generateListOfUniqueCategories(_categories);
          this._categories$.next(categories);
          const subCategories = this.quizService.generateListOfSubCategories(_categories);
          this._subCategories$.next(subCategories);
        }),
      ).subscribe(),
    );
  }

  private _setSubCategoriesChangeLogicBasedOnCategoryValueChanges() {
    this.subCategories$ = this.categoryControl.valueChanges.pipe(
      combineLatestWith(this._subCategories$),
      map(([categoryName, subCategories]) => subCategories.get(categoryName)),
      tap(() => this.subCategoryControl.reset()),
      tap(subCategories => {
        if(subCategories) this.subCategoryControl.addValidators(Validators.required);
        else this.subCategoryControl.removeValidators(Validators.required);
        this.subCategoryControl.updateValueAndValidity();
      }),
    );
  }
}
