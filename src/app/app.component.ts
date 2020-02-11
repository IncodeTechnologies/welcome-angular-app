import { Component, OnInit, ElementRef } from '@angular/core';

declare var OnBoarding: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'my-app';

  showMessage() {
    const hello = document.getElementById('hello');
    hello.innerHTML = '<app-hello-world></app-hello-world>';
  }

  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    let onBoarding;
    let token;

    const container = this.elRef.nativeElement.querySelector('#camera-container');

    createOnBoarding(); // initialize the instance
    createSession().then(mytoken => {
      console.log(mytoken);
      token = mytoken;
      renderTutorialFront(); // render and start autodetect of the front ID camera
    });

    function log(r) {
      alert(JSON.stringify(r));
    }

    function createOnBoarding() {
      const apiKey = 'f35844c8bcb417be1a64fd6e8d622cc93b0fcfaa';
      const apiURL = 'https://stage-api.incodesmile.com';
      onBoarding = OnBoarding.create({
        apiKey,
        apiURL,
      });
      console.log(onBoarding);
    }

    function createSession() {
      return onBoarding.createSession('MX');
    }

    function showError() {
      alert('Some error');
    }

    function renderTutorialFront() {
      onBoarding.renderFrontTutorial(container, {
        onSuccess: () => {
          renderFrontIDCamera();
        },
      });
    }

    function renderFrontIDCamera() {
      onBoarding.renderCamera('front', container, {
        onSuccess: r => {
          log(r);
          renderBackIDCamera(token.token);
        },
        onError: showError,
      });
    }

    function renderTutorialBack() {
      onBoarding.renderBackTutorial(container, {
        onSuccess: () => {
          renderBackIDCamera(token.token);
        },
      });
    }

    function renderBackIDCamera(token: any) {
      onBoarding.renderCamera('back', container, {
        onSuccess: r => {
          renderSelfieCamera(token);
        },
        onError: () => renderSelfieCamera(token),
      });
    }

    function renderTutorialSelfie() {
      onBoarding.renderSelfieTutorial(container, {
        onSuccess: () => {
          renderSelfieCamera(token.token);
        },
      });
    }

    function renderSelfieCamera(token: any) {
      onBoarding.renderCamera('selfie', container, {
        onSuccess: r => {
          viewOCRDates(token);
        },
        onError: () => viewOCRDates(token),
      });
    }

    function renderConference(token: any) {
      onBoarding.renderConference(
        container,
        {
          token,
        },
        {
          onSuccess: status => console.log(status),
        },
      );
    }

    function addToQueue() {
      onBoarding.addToQueue({
        token: token.token,
      });
    }

    function viewOCRDates(token: any) {
      onBoarding
        .processId()
        .then(() =>
          onBoarding.ocrData({
            token: token.token,
          }),
        )
        .then(async ocrData => {
          try {
            // alert(ocrData.name + ' Espera a un ejecutivo disponible');
            // this.ocrData = ocrData;
            log(ocrData);
            const score = await onBoarding
              .getScore({
                interviewId: token.interviewId,
                token: token.token,
              })
              .then(score => {
                //do something with the score
              });
            log(score);
            renderConference(token);
          } catch (e) {
            log(e);
          }
        });
    }
  }
}
