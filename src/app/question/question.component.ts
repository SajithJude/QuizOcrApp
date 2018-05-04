import { Component, OnInit, Input } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  submitted : boolean = false;

  @Input() question : string;
  @Input() answers : string[] = new Array<string>();
  googlePages : string[] = new Array<string>();
  likelihood : number[] = new Array<number>();

  constructor(private http: Http) { }

  ngOnInit() {
  }

  handleSubmit() {
    this.submitted = true;
    for(var i = 0; i < this.answers.length - 1; i++)
    {
      this.http.get(
        "https://www.googleapis.com/customsearch/v1?q=" +
        this.question.replace(/[^\w\s]/gi, '').toLowerCase().split(" ").join("+") +
        this.answers[i].replace(/[^\w\s]/gi, '').toLowerCase().split(" ").join("+") +
        "&num=10&c2coff=1&filter=0&lr=lang_en&" +
        "key=AIzaSyAnbHJbJR8zdaDhG9pigGjtU3SKLHjFHqU&" +
        "cx=009790495881824375879:so76g6onpgu"
        )
        .subscribe(
          (res: any) => {
            this.googlePages[i] = JSON.stringify(res).toLowerCase();
            this.likelihood[i] = this.countOcurrences(this.googlePages[i],this.answers[i]);
          },
          (err: Error) => this.handleError
        );
    }
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

}
