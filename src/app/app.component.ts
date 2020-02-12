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
  title = 'my-app';
  boardd;
  token;
  container;

  createSession() {
    console.log(this.boardd);
    console.log(this.apiURL);
    return this.boardd.createSession('MX');
  }

  ngOnInit() {
    console.log(this.title);

    this.token = 'asdada';

    this.boardd = OnBoarding.create({
      apiKey: this.apiKey,
      apiURL: this.apiURL,
    });

    this.container = document.getElementById('camera-container');

    this.createSession().then(mytoken => {
      console.log(mytoken);
      this.token = mytoken;
    }).catch(err => console.log(err));

    function log(r) {
      alert(JSON.stringify(r));
    }

    function showError() {
      alert('Some error');
    }

    function renderTutorialFront() {
      this.boardd.renderFrontTutorial(this.container, {
        onSuccess: () => {
          renderFrontIDCamera();
        },
      });
    }

    function renderFrontIDCamera() {
      this.boardd.renderCamera('front', this.container, {
        onSuccess: r => {
          log(r);
          renderBackIDCamera(this.token.token);
        },
        onError: showError,
      });
    }

    function renderTutorialBack() {
      this.boardd.renderBackTutorial(this.container, {
        onSuccess: () => {
          renderBackIDCamera(this.token.token);
        },
      });
    }

    function renderBackIDCamera(token: any) {
      this.boardd.renderCamera('back', this.container, {
        onSuccess: r => {
          renderSelfieCamera(token);
        },
        onError: () => renderSelfieCamera(token),
      });
    }

    function renderTutorialSelfie() {
      this.boardd.renderSelfieTutorial(this.container, {
        onSuccess: () => {
          renderSelfieCamera(this.token.token);
        },
      });
    }

    function renderSelfieCamera(token: any) {
      this.boardd.renderCamera('selfie', this.container, {
        onSuccess: r => {
          viewOCRDates(token);
        },
        onError: () => viewOCRDates(token),
      });
    }

    function renderConference(token: any) {
      this.boardd.renderConference(
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
      this.boardd.addToQueue({
        token: this.token.token,
      });
    }

    function viewOCRDates(token: any) {
      this.boardd
        .processId()
        .then(() =>
        this.boardd.ocrData({
            token: token.token,
          }),
        )
        .then(async ocrData => {
          try {
            // alert(ocrData.name + ' Espera a un ejecutivo disponible');
            // this.ocrData = ocrData;
            log(ocrData);
            const score = await this.boardd
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
}
