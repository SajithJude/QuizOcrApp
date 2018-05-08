import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/forkJoin'

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionComponent implements OnInit {

  ocrText : string;
  question : string;
  answers : string[] = ["","",""];
  snippets : string[] = ["","",""];
  answerCounts : number[] = [0,0,0];
  likelihood : string[] = ["","",""];

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.ocrText = this.route.snapshot.params.ocrText.replace(/(\r\n\t|\n|\r\t)/gm,"_"); 
    var questionStartIdx = 0;//this.ocrText.search("_H") + 4;
    var questionEndIdx = this.ocrText.search("\\?_") + 1;
    var answersEndIdx = this.ocrText.search("_Swipe") + 1;
    this.question = this.ocrText.substring(questionStartIdx, questionEndIdx).replace(/_/g," ");
    //`Which of these companies was founded in the late 1800s?`  //Nintendo
    this.answers = this.ocrText.substring(questionEndIdx + 1, answersEndIdx - 1).split(/_/g);
    //["Lego", "Hasbro", "Nintendo"];
    this.commenceGoogleSearch();
  }

  commenceGoogleSearch() {
    var self = this;
    Observable.forkJoin(
      self.searchForAnswer(0),
      self.searchForAnswer(1),
      self.searchForAnswer(2)
    )
    .subscribe(
      (res: any) => {
        self.answerCounts.forEach(function(answer, j) {
          if(answer != -1)
          {
            self.likelihood[j] = Math.round(
              (self.answerCounts[j] / self.sum(self.answerCounts)) * 100) + '%';
          }
          else
          {
            self.likelihood[j] = "?";
          }
        })
      }
    );
  }

  returnToCamera() {
    this.router.navigate(['camera']);
  }

  private searchForAnswer(i : number) {
    var self = this;
    var questionQuery = self.question.replace(/[^\w\s]/gi, '').toLowerCase().split(" ").join("+");
    var answerQuery = self.answers[i].replace(/[^\w\s]/gi, '').toLowerCase().split(" ").join("+");
    return self.http.get(
      "https://www.googleapis.com/customsearch/v1?q=" + questionQuery + " " +
      answerQuery + "&hq=" + answerQuery + "&exactterms=" + answerQuery + 
      "&num=10&c2coff=1&lr=lang_en&" +
      "&key=AIzaSyAnbHJbJR8zdaDhG9pigGjtU3SKLHjFHqU" +
      "&cx=009790495881824375879:so76g6onpgu"
      )
    .map(
      (res: any) => {
        if (res.json().items)
        {
          self.snippets[i] = res.json().items.map(i => i.snippet).join("\n\n").toLowerCase();
          var regExp = new RegExp("\\b" + self.answers[i] +"\\b", "gi");
          self.snippets[i] = self.snippets[i].replace(regExp, `<span class="answer-match">$&</span>`);
          self.answerCounts[i] = self.countOcurrences(self.snippets[i],self.answers[i]);
        }
        else
        {
          self.snippets[i] = "";
          self.answerCounts[i] = -1;
        }
        return res.json();
      },
      (err: Error) => {
        self.handleError(err);
        self.likelihood.forEach(function(l){
          l = "?";
        });
      }
    );
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
