import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
//import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

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
    this.sdk = await OnBoarding.create({
      apiKey: this.apiKey,
      apiURL: this.apiURL,
      encrypt: true,
      theme: this.theme,
      tokboxApiKey: this.tokboxApiKey,
    });
    await this.sdk.warmup();
    const _token = await this.createSession().then((token) => token);
    this.token = _token;
    await this.sdk.publishKeys(this.token.token);

    await this.sdk.mock({
      token: this.token.token,
      interviewId: "602ffb95b3a8a3001204eb54",
    });

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
