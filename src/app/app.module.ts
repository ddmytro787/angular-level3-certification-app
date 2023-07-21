import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {QuizMakerComponent} from './quiz-maker/quiz-maker.component';
import {QuizComponent} from './quiz/quiz.component';
import {QuestionComponent} from './question/question.component';
import {AnswersComponent} from './answers/answers.component';
import {LoaderComponent} from './loader/loader.component';
import {LoaderRollerComponent} from './loader/loader-roller/loader-roller.component';
import {LoaderInterceptor} from './loader/loader.interceptor';
import {AutocompleteComponent} from './autocomplete/autocomplete.component';
import {NotifierComponent} from './notifier/notifier.component';
import {NotifierInterceptor} from './notifier/notifier.interceptor';
import {EventMessagePipe} from './notifier/event-message.pipe';
import {FilterByPipe} from './autocomplete/filter-by.pipe';
import {MatchHighlighterDirective} from './autocomplete/match-highlighter.directive';


@NgModule({
  declarations: [
    AppComponent,
    QuizMakerComponent,
    QuizComponent,
    QuestionComponent,
    AnswersComponent,
    LoaderComponent,
    LoaderRollerComponent,
    AutocompleteComponent,
    NotifierComponent,
    EventMessagePipe,
    FilterByPipe,
    MatchHighlighterDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotifierInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
