import { Component, OnInit, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  submitted : boolean = false;

  @Input() question : string;
  @Input() answers : string[] = ["","",""];
  googlePages : string[] = ["","",""];
  bingPages : string[] = ["","",""];
  answerCounts : number[] = [0,0,0];
  likelihood : string[] = ["","",""];

  constructor(private router: Router, private http: Http) { }

  ngOnInit() {
  }

  handleSubmit() {
    var self = this;
    self.submitted = true;
    self.answers.forEach(function(answer, i) {
      self.http.get(
        "https://www.googleapis.com/customsearch/v1?q=" +
        self.question.replace(/[^\w\s]/gi, '').toLowerCase().split(" ").join("+") +
        self.answers[i].replace(/[^\w\s]/gi, '').toLowerCase().split(" ").join("+") +
        "&num=10&c2coff=1&filter=0&lr=lang_en&" +
        "key=AIzaSyAnbHJbJR8zdaDhG9pigGjtU3SKLHjFHqU&" +
        "cx=009790495881824375879:so76g6onpgu"
        )
        .subscribe(
          (res: any) => {
            self.googlePages[i] = JSON.stringify(res).toLowerCase();
            self.answerCounts[i] = self.countOcurrences(self.googlePages[i],self.answers[i]);
            if(i == self.answers.length - 1)
            {
              self.answerCounts.forEach(function(answer, j) {
                self.likelihood[j] = Math.round(
                  (self.answerCounts[j] / self.sum(self.answerCounts)) * 100) + '%';
              });
            }
          },
          (err: Error) => self.handleError
        );
    });
  }

  returnToCamera() {
    this.router.navigate(['camera']);
  }
  
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
  }

  private countOcurrences(str, value) {
    var regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
  }

  private isAnswerLoaded(num : number) {
    return this.likelihood[num] != "";
  }

  private sum(numbers : number[]) {
    return numbers.reduce(function(a,b) {
      return a + b;
    });
  }

}
