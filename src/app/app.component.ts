import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

declare var OnBoarding: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  apiKey = "34c6fceca75e456f25e7e99531e2425c6c1de443";
  apiURL = "https://frontend-dev-api-citibanamex.incodesmile.mx";
  tokboxApiKey = "46501002";
  step = 0;
  sdk;
  token;
  permissionMessage = "Custom text";
  backgroundColor = "blue";
  fingerPrintToken = "5uYRiI0XM6p8k4124ELX";
  ip;
  deviceType = "WEBAPP";
  fingerPrint;
  customImagesSrc;
  incodeConnectingImageSrc: "https://cdn2.unrealengine.com/15br-theflash-screenshot-newsheader-1920x1080-0e77cc2ff454.jpg";

  theme = {
    mainButton: {
      backgroundColor: "#006DB2",
      color: "#FFF",
      borderRadius: "5px",
      fontFamily: "Arial",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "#006DB2",
      borderRadius: "5px",
      fontFamily: "Arial",
      border: "1px solid #006DB2",
      padding: "18px 25px",
      width: "100%",
    },
    modal: {
      borderRadius: "5px",
    },
  };

  constructor(private ref: ChangeDetectorRef) {}

  async ngOnInit() {
    this.customImagesSrc = {
      incodeConnectingImageSrc: ""
    };
    this.sdk = await OnBoarding.create({
      apiKey: this.apiKey,
      apiURL: this.apiURL,
      encrypt: true,
      theme: this.theme,
      tokboxApiKey: this.tokboxApiKey,
      lang: "es",
      translations: {
        support: {
          queuePlace: "Tienes el <1>{{index}}</1> lugar en la fila",
        },
      },
    });
    await this.sdk.warmup();
    const _token = await this.createSession().then((token) => token);
    this.token = _token;

    await this.sdk.publishKeys(this.token.token);
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async createSession() {
    return await fetch(
      "https://frontend-dev-api-citibanamex.incodesmile.mx/omni/test/start",
      {
        method: "POST",
        body: JSON.stringify({ countryCode: "MX" }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-version": "1.0",
          "x-api-key": this.apiKey,
        },
      }
    )
      .then((res) => res.json().then((res) => res))
      .catch((error) => console.error("Error:", error));
  }

  nextStep = () => {
    console.log("Success!");

    if (this.step === 4) {
      console.log("process id");

      this.sdk
        .processId({
          token: this.token.token,
        })
        .then((data) => console.log(data));
    }

    this.step++;
    this.ref.detectChanges();
  };

  skipNextStep = () => {
    console.log("Success!");

    this.step = this.step + 2;
    this.ref.detectChanges();
  };

  handleLog = (ev) => {
    console.log(ev);

    const eventType = ev.detail.type;

    if (eventType === "successCapture") {
      this.nextStep();
    }
  };
}
