import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../services/twitter.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  constructor(private twitterService: TwitterService) { }

  ngOnInit() {

    this.twitterService.getTwits("deportivo cali").then(
      result => {
           
          if(result.code != 200){
            console.log(result);
          }else{
            console.log(result.data);
          }
      },
      error => {
        console.log(error);
      }
    );
  }

}
