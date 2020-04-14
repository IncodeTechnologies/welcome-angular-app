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
  permissionMessage = 'Custom text';
  backgroundColor = 'blue';

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.sdk = OnBoarding.create({
      apiKey: this.apiKey,
      apiURL: this.apiURL,
      lang: 'es'
    });

    this.createSession().then(mytoken => {
      this.token = mytoken;
    });
  }

  createSession() {
    return this.sdk.createSession('MX');
  }

  nextStep = () => {
    console.log('Success!');

    this.step++;
    this.ref.detectChanges();
  }

  skipNextStep = () => {
    console.log('Success!');
    this.step = this.step + 2;
    this.ref.detectChanges();
  }

  handleLog = (ev) => {
    console.log(ev);

    const eventType = ev.detail.type;
    
    if (eventType === 'successCapture' || eventType === 'success') {
      this.nextStep();
    }
  }
}
