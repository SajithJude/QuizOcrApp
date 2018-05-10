import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { OcrTextService } from '../services/ocr-text.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/forkJoin'
import { AppConfig } from '../app.config';

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
  images : string[] = ["","",""];
  dedupedImages : string[];
  answerCounts : number[] = [0,0,0];
  likelihood : string[] = ["","",""];
  apiKey: string;
  cxKey: string;

  constructor(
    private router : Router, private http : Http,
    private ocrTextService: OcrTextService, private config: AppConfig
  ) {
    this.apiKey = config.getConfig('googleApiKey');
    this.cxKey = config.getConfig('googleCxKey');
  }

  ngOnInit() {
    this.ocrText = this.ocrTextService.ocrText.replace(/(\r\n\t|\n|\r\t)/gm,"_");
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
        self.dedupedImages = [].concat.apply([], self.images).filter(function(elem, index, self) {
          return index == self.indexOf(elem);
        });;
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
    var questionQuery = self.question.toLowerCase().split(" ").join("+");
    var answerQuery = self.answers[i].toLowerCase().split(" ").join("+");
    if(!self.question) return;
    return self.http.get(
      "https://www.googleapis.com/customsearch/v1?q=" + questionQuery + " " +
      answerQuery + "&hq=" + answerQuery + "&exactterms=" + answerQuery + 
      "&num=10&c2coff=1&lr=lang_en&" +
      "&key=" + this.apiKey +
      "&cx=" + this.cxKey
      )
    .map(
      (res: any) => {
        if (res.json().items)
        {
          self.snippets[i] = res.json().items.map(i => i.snippet)
            .sort(function(a, b){    // sort snippets for highest count of answer
              var count1 = self.countOcurrences(a, self.answers[i]);
              var count2 = self.countOcurrences(b, self.answers[i]);
              if (count1 < count2) return 1;
              if (count1 > count2) return -1;
              if (count1 == count2) return 0;
            })
            .join("\n\n").toLowerCase();
          self.images[i] = res.json().items
            .filter(i => i.pagemap != undefined)
            .map(i => i.pagemap.cse_thumbnail)
            .filter(c => c != undefined)
            .map(c => c[0].src);
          var regExp = new RegExp("\\b" + self.answers[i] +"\\b", "gi");
          self.snippets[i] = self.snippets[i].replace(regExp, `<span class="answer-match">$&</span>`);
          self.answerCounts[i] = self.countOcurrences(self.snippets[i],self.answers[i]);
        }
        else
        {
          self.snippets[i] = "No Results found";
          self.images[i] = "";
          self.answerCounts[i] = 0;
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
