import { Component, OnInit, Injector } from '@angular/core';

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

  ngOnInit() {
    this.sdk = OnBoarding.create({
      apiKey: this.apiKey,
      apiURL: this.apiURL,
    });

    console.log(this.sdk);

    this.createSession().then(mytoken => {
      this.token = mytoken;
    });

    function log(r) {
      alert(JSON.stringify(r));
    }

    function renderBackIDCamera(token: any) {
      this.sdk.renderCamera('back', this.container, {
        onSuccess: r => {
          renderSelfieCamera(token);
        },
        onError: () => renderSelfieCamera(token),
      });
    }

    function renderTutorialSelfie() {
      this.sdk.renderSelfieTutorial(this.container, {
        onSuccess: () => {
          renderSelfieCamera(this.token.token);
        },
      });
    }

    function renderSelfieCamera(token: any) {
      this.sdk.renderCamera('selfie', this.container, {
        onSuccess: r => {
          viewOCRDates(token);
        },
        onError: () => viewOCRDates(token),
      });
    }

    function renderConference(token: any) {
      this.sdk.renderConference(
        this.container,
        {
          token,
        },
        {
          onSuccess: status => console.log(status),
        },
      );
    }

    function addToQueue() {
      this.sdk.addToQueue({
        token: this.token.token,
      });
    }

    function viewOCRDates(token: any) {
      this.sdk
        .processId()
        .then(() =>
        this.sdk.ocrData({
            token: token.token,
          }),
        )
        .then(async ocrData => {
          try {
            // alert(ocrData.name + ' Espera a un ejecutivo disponible');
            // this.ocrData = ocrData;
            log(ocrData);
            const score = await this.sdk
              .getScore({
                interviewId: token.interviewId,
                token: token.token,
              })
              .then(score => {
                //do something with the score
                console.log(score);
              });
            log(score);
            renderConference(token);
          } catch (e) {
            log(e);
          }
        });
    }
  }

  createSession() {
    return this.sdk.createSession('MX');
  }

  nextStep = () => {
    console.log('Success!');
    this.step++;
  }

  skipNextStep = () => {
    console.log('Success!');
    this.step = this.step + 2;
  }
}
