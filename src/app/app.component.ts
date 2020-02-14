import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

declare var OnBoarding: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  apiKey = 'f35844c8bcb417be1a64fd6e8d622cc93b0fcfaa';
  apiURL = 'https://stage-api.incodesmile.com';
  step = 0;
  sdk;
  token;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.sdk = OnBoarding.create({
      apiKey: this.apiKey,
      apiURL: this.apiURL,
    });

    console.log(this.sdk);

    this.createSession().then(mytoken => {
      this.token = mytoken;
    });
  }

  createSession() {
    return this.sdk.createSession('MX');
  }

  nextStep = () => {
    console.log('Success!');
    console.log(this.token);

    if (this.step === 4) {
      console.log('Here')
      this.sdk.processId({
        token: this.token.token,
        queueName: ''
      })
    }

    if (this.step === 6) {
      this.sdk.ocrData({
        token: this.token.token,
      })
    }

    this.step++;
    this.ref.detectChanges();
  }

  skipNextStep = () => {
    console.log('Success!');
    this.step = this.step + 2;
    this.ref.detectChanges();
  }
}
