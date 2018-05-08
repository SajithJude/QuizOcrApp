import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  ocrText : string;
  question : string;
  answers : string[] = ["","",""];
  googlePages : string[] = ["","",""];
  answerCounts : number[] = [0,0,0];
  likelihood : string[] = ["","",""];

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.ocrText = this.route.snapshot.params.ocrText; 
    var questionStartIdx = this.ocrText.search("\\nH") + 4;
    var questionEndIdx = this.ocrText.search("\\?\\n") + 1;
    var answersEndIdx = this.ocrText.search("\\nSwipe") + 1;
    this.question = this.ocrText.substring(questionStartIdx, questionEndIdx);
    this.answers = this.ocrText.substring(questionEndIdx + 1, answersEndIdx - 1).split(/\n/);
    this.commenceGoogleSearch();
  }

  commenceGoogleSearch() {
    var self = this;
    self.answers.forEach(function(answer, i) {
      self.http.get(
        "https://www.googleapis.com/customsearch/v1?q=" +
        self.question.replace(/[^\w\s]/gi, '').toLowerCase().replace(/(\r\n\t|\n|\r\t)/gm," ").split(" ").join("+") + " " +
        self.answers[i].replace(/[^\w\s]/gi, '').toLowerCase().replace(/(\r\n\t|\n|\r\t)/gm," ").split(" ").join("+") +
        "&num=10&c2coff=1&filter=0&lr=lang_en&" +
        "key=AIzaSyAnbHJbJR8zdaDhG9pigGjtU3SKLHjFHqU&" +
        "cx=009790495881824375879:so76g6onpgu"
        )
        .subscribe(
          (res: any) => {
            self.googlePages[i] = res.json().items.map(i => i.snippet).join(" ").toLowerCase();
            self.answerCounts[i] = self.countOcurrences(self.googlePages[i],self.answers[i]);
            if(i == self.answers.length - 1)
            {
              self.answerCounts.forEach(function(answer, j) {
                self.likelihood[j] = Math.round(
                  (self.answerCounts[j] / self.sum(self.answerCounts)) * 100) + '%';
              });
            }
          },
          (err: Error) => {
            self.handleError(err);
            self.likelihood.forEach(function(l){
              l = "?";
            });
          }
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
    var regExp = new RegExp("\\b" + value +"\\b", "gi");
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
