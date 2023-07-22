import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatestWith, map, Observable, ReplaySubject, tap } from 'rxjs';
import {
  ApiQuestion,
  Category,
  Difficulty,
  Question,
  Results,
} from './data.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private _questions$ = new ReplaySubject<Question[]>(1);
  questions$ = this._questions$.asObservable();

  private API_URL = "https://opentdb.com/";
  private latestResults!: Results;

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<{ trivia_categories: Category[] }>(this.API_URL + "api_category.php", {
      headers: { 'loader-message': 'Loading categories...' },
    }).pipe(
      map(res => res.trivia_categories)
    );
  }

  createQuiz(categoryId: string, difficulty: Difficulty): Observable<Question[]> {
    return this._loadQuiz(categoryId, difficulty, 'Creating quiz...').pipe(
      tap(questions => this._questions$.next(questions)),
    );
  }

  swapOneQuestionInQuiz(categoryId: string, difficulty: Difficulty, questionId: string) {
    return this._loadQuiz(categoryId, difficulty, 'Changing quiz question...').pipe(
      combineLatestWith(this.questions$),
      map(([newQuestions, questions]) => {
        const randomPickIndex = Math.floor(Math.random() * newQuestions.length);
        const questionToAdd = newQuestions[randomPickIndex];
        const questionToReplaceIndex = questions.findIndex(q => q.question === questionId);
        if(questionToReplaceIndex >= 0)
          questions.splice(questionToReplaceIndex, 1, questionToAdd);
        return questions;
      }),
      tap(questions => this._questions$.next(questions)),
    );
  }

  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index])
        score++;
    })
    this.latestResults = {questions, answers, score};
  }

  getLatestResults(): Results {
    return this.latestResults;
  }

  generateListOfUniqueCategories(categories: Category[]) {
    const listOfUniqueCategoryNames: string[] = [];
    const listOfUniqueCategories: Category[] = [];
    let subCategoryDetectorIndex: number;
    let categoryName: string;
    let category: Category;

    categories.forEach(_category => {
      subCategoryDetectorIndex = _category.name.indexOf(':');
      category = _category;
      categoryName = _category.name;

      if(subCategoryDetectorIndex >= 0) {
        categoryName = categoryName.slice(0, subCategoryDetectorIndex);
        category = { id: categoryName, name: categoryName };
      }

      if(!listOfUniqueCategoryNames.includes(categoryName)) {
        listOfUniqueCategoryNames.push(categoryName);
        listOfUniqueCategories.push(category);
      }
    });

    return listOfUniqueCategories;
  }

  generateListOfSubCategories(categories: Category[]) {
    const subCategoriesMap = new Map<string, Category[]>;
    let subCategoryDetectorIndex: number;
    let categoryName: string;
    let subCategoryName: string;
    let subCategoriesMapValue: Category[];

    categories.forEach(category => {
      subCategoryDetectorIndex = category.name.indexOf(':');
      if(subCategoryDetectorIndex < 0) return;

      subCategoryName = category.name.slice(subCategoryDetectorIndex + 1, category.name.length).trim();
      categoryName = category.name.slice(0, subCategoryDetectorIndex);
      subCategoriesMapValue = subCategoriesMap.get(categoryName) || [];
      subCategoriesMap.set(categoryName, [...subCategoriesMapValue, { id: category.id, name: subCategoryName }]);
    });

    return subCategoriesMap;
  }

  clearQuestions() {
    this._questions$.next([]);
  }

  private _loadQuiz(categoryId: string, difficulty: Difficulty, state: string) {
    return this.http.get<{ results: ApiQuestion[] }>(
      `${this.API_URL}/api.php?amount=5&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`,
      {
        headers: { 'loader-message': state },
      })
      .pipe(
        map(res => {
          const quiz: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));
          return quiz;
        }),
      );
  }
}
