import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

enum Color {
  Day = "day",
  Night = "night",
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public ColorEnum = Color;

  public currentTime = new Date().getHours().toString().padStart(2, "0") + ":" + new Date().getMinutes().toString().padStart(2, "0");;

  public color = Color.Day;

  public states = [true, true, true, true, true];

  public form = new FormGroup({
    dayStartsAt: new FormControl<string | null>({ value: null, disabled: false }, Validators.required),
    nightStartsAt: new FormControl<string | null>({ value: null, disabled: false }, Validators.required),
  });

  public ngOnInit(): void {
    const dayStartsAt = localStorage.getItem("dayStartsAt") || "06:50";
    const nightStartsAt = localStorage.getItem("nightStartsAt") || "19:30";

    this.form.get("dayStartsAt")?.setValue(dayStartsAt);
    this.form.get("nightStartsAt")?.setValue(nightStartsAt);
    
    this.calculateTime();
    setInterval(() => {
      this.calculateTime();
    }, 1000)
  }

  public save(): void {
    if (!this.form.valid) {
      return;
    }

    localStorage.setItem("dayStartsAt", this.form.get("dayStartsAt")!.value!)
    localStorage.setItem("nightStartsAt", this.form.get("nightStartsAt")!.value!)

    this.calculateTime();
  }

  private calculateTime(): void {
    const date = new Date();
    const hour = date.getHours();
    const minute = +date.getMinutes().toString().padStart(2, "0");

    this.currentTime = hour + ":" + minute.toString().padStart(2, "0");
    const totalMinutes = hour * 60 + minute;

    const nightStartsAt = localStorage.getItem("nightStartsAt") || "19:30";
    const dayStartsAt = localStorage.getItem("dayStartsAt") || "06:50";

    const minHour = +dayStartsAt.split(":")[0];
    const minMinutes = +dayStartsAt.split(":")[1];
    const minTotalMinutes = minHour * 60 + minMinutes;

    const maxHour = +nightStartsAt.split(":")[0];
    const maxMinutes = +nightStartsAt.split(":")[1];
    const maxTotalMinutes = maxHour * 60 + maxMinutes;

    const isDay = totalMinutes > minTotalMinutes && totalMinutes < maxTotalMinutes;
    this.color = isDay ? Color.Day : Color.Night;

    if (!isDay) {
      for (let i = 0; i < this.states.length; i++) {
        this.states[i] = false;
      }

      const difference = minTotalMinutes - totalMinutes;
      const isInLastHour = difference > 0 && difference < 60;
      if (isInLastHour) {
        const ratio = 5 - Math.floor(difference / 12);
        for (let i = 0; i < ratio; i++) {
          this.states[i] = true;
        }
      }
    }
  }
}
