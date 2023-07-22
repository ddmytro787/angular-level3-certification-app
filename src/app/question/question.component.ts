import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../data.models';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  @Input({required: true})
  question!: Question;
  @Input()
  correctAnswer?: string;
  @Input()
  userAnswer?: string;

  @Output()
  change = new EventEmitter<string>();

  @Output()
  swap = new EventEmitter();

  currentSelection!: string;

  constructor(private quiz: QuizService) {
  }

  get isChangeQuestionAllowed() {
    return !!this.quiz.attemptsToChangeQuestion;
  }

  getButtonClass(answer: string): string {
    if (! this.userAnswer) {
        if (this.currentSelection == answer)
          return "tertiary";
    } else {
      if (this.userAnswer == this.correctAnswer && this.userAnswer == answer)
        return "tertiary";
      if (answer == this.correctAnswer)
        return "secondary";
    }
    return "primary";
  }

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.change.emit(answer);
  }
}
