import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Question } from '../data.models';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnChanges {

  @Input()
  questions: Question[] | null = [];

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  isQuestions = false;
  amountOfQuestions = 0;
  amountOfRequiredAnswers = 0;

  @Output() swapQuestion = new EventEmitter<string>();

  ngOnChanges() {
    this.isQuestions = !!this.questions?.length;
    this.amountOfQuestions = this.questions?.length || 0;
    this.amountOfRequiredAnswers = this.amountOfQuestions;
  }

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

  onChangeQuestion(index: number, value: string) {
    this.userAnswers[index] = value;
    this._setAmountOfRequiredAnswers();
  }

  onSwapQuestion(answerIndex: number, questionId: string) {
    this._clearAnswerForSwappedQuestion(answerIndex);
    this.swapQuestion.emit(questionId);
    this._setAmountOfRequiredAnswers();
  }

  private _clearAnswerForSwappedQuestion(index: number) {
    this.userAnswers[index] = '';
  }

  private _setAmountOfRequiredAnswers() {
    this.amountOfRequiredAnswers = this.amountOfQuestions - this.userAnswers.filter(answer => !!answer).length;
  }
}
