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
  tokboxAPI = "46501002";
  step = 0;
  sdk;
  token;
  permissionMessage = "Custom text";
  backgroundColor = "blue";
  fingerPrintToken = "5uYRiI0XM6p8k4124ELX";
  ip;
  deviceType = "WEBAPP";
  fingerPrint;
  
  theme = {
    main: '#3db0f7',
    buttonBorderRadius: '0px',
    buttonColor: '#fff',
  };

  constructor(private ref: ChangeDetectorRef) {}

  async ngOnInit() {
    this.sdk = OnBoarding.create({
      apiKey: this.apiKey,
      apiURL: this.apiURL,
      encrypt: true,
      theme: this.theme,
      tokboxAPI: this.tokboxAPI
    });

    this.token = await this.createSession().then((mytoken) => mytoken);

    await this.sdk.publishKeys(this.token.token);

    this.ip = await fetch("https://api.ipify.org").then((response) =>
      response.text()
    );

    this.fingerPrint = await FingerprintJS.load({
      token: this.fingerPrintToken,
    }).then((fp) => fp.get());

    console.log(this.fingerPrint);
    console.log(this.ip);

    await this.sdk.postFingerPrint({
      hash: this.fingerPrint.visitorId,
      ip: this.ip,
      deviceType: this.deviceType,
      data: JSON.stringify(this.fingerPrint),
      token: this.token.token,
    });

    await this.getCurrentPosition().then(async (pos) => {
      console.log(pos);
      await this.sdk.addGeolocation({
        token: this.token,
        longitude: pos["coords"].longitude,
        latitude: pos["coords"].latitude,
      });
    });

    const res = await this.sdk.fetchProcessingStatus({ token: this.token });
    console.log(res);
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  createSession() {
    return fetch(
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
