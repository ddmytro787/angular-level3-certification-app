import { Component, Input, OnChanges } from '@angular/core';
import { Question, Results } from '../data.models';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnChanges {

  @Input()
  data!: Results;

  questions: Question[] = [];
  answers: string[] = [];
  score = 0;

  constructor(
    private quiz: QuizService,
    private router: Router,
  ) {
  }

  ngOnChanges() {
    this.questions = this.data?.questions || [];
    this.answers = this.data?.answers || [];
    this.score = this.data?.score || 0;
  }

  onCreateQuiz() {
    this.quiz.clearQuestions();
    this.router.navigateByUrl('/');
  }

}
