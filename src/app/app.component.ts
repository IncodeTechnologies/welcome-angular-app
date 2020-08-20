import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

declare var OnBoarding: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  apiKey = "34c6fceca75e456f25e7e99531e2425c6c1de443";
  apiURL = "https://dev-api-citibanamex.incodesmile.mx";
  step = 0;
  sdk;
  token;
  permissionMessage = "Custom text";
  backgroundColor = "blue";

  constructor(private ref: ChangeDetectorRef) {}

  async ngOnInit() {
    this.sdk = OnBoarding.create({
      apiKey: this.apiKey,
      apiURL: this.apiURL,
      encrypt: true,
    });

    this.token = await this.createSession().then((mytoken) => mytoken);

    await this.sdk.publishKeys(this.token.token);
  }

  createSession() {
    return fetch("https://dev-api-citibanamex.incodesmile.mx/omni/test/start", {
      method: "POST",
      body: JSON.stringify({ countryCode: "MX" }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-version": "1.0",
        "x-api-key": this.apiKey,
      },
    })
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
