import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  
  constructor(private router: Router) {}


  onClick() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  someAction() {
    this.router.navigate(['facedetection']);
    var t = document.getElementById("home");
    t.innerText = "Face Recognition";
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  product(){
    this.router.navigate(['product'])
    var t = document.getElementById("home");
    t.innerText = "Product Information";
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

    emotion(){
      this.router.navigate(['emotion'])
      // this.router.navigate(['product'])
      var t = document.getElementById("home");
      t.innerText = "Face Emotion Detection";
      var x = document.getElementById("myLinks");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }

    pharma(){
      this.router.navigate(['pharma'])
      var t = document.getElementById("home");
      t.innerText = "Pharmaceutical Drug info";
      var x = document.getElementById("myLinks");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }



    map(){
      this.router.navigate(['map'])
      var t = document.getElementById("home");
      t.innerText = "Find it on the Map";
      var x = document.getElementById("myLinks");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }

    location(){
      this.router.navigate(['location'])
     var t = document.getElementById("home");
      t.innerText = "Location Based Content";
      var x = document.getElementById("myLinks");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }

    poses(){
      this.router.navigate(['poses'])
    var t = document.getElementById("home");
      t.innerText = "Try Body Poses";
      var x = document.getElementById("myLinks");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }

    translate(){
      this.router.navigate(['translate'])
    var t = document.getElementById("home");
      t.innerText = "Language Translation";
      var x = document.getElementById("myLinks");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }

 
 
  

}
