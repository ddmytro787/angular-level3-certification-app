import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
    return this.http.get<{ results: ApiQuestion[] }>(
        `${this.API_URL}/api.php?amount=5&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`,
      {
        headers: { 'loader-message': 'Creating quiz...' },
      })
      .pipe(
        map(res => {
          const quiz: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));
          return quiz;
        })
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
}
