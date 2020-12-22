import { BehaviorSubject } from 'rxjs';
import { HelperService } from './../services/helper.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InitialData } from '../models/interfaces';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss']
})
export class WelcomeModalComponent {
  private _initialData = {
    x: 0,
    y: 0,
    obstacleDensity: 1
  };
  @Output() initialDataEmitter: EventEmitter<InitialData> = new EventEmitter();
  @Input() embeded = false;

  constructor(private _helperService: HelperService) {}

  // GETTERS // ----------------------------------------

  public get initialData(): InitialData {
    return this._initialData;
  }

  public get loadingMission(): BehaviorSubject<boolean> {
    return this._helperService.loadingMission;
  }

  // PUBLIC METHODS // ----------------------------------------

  public checkNumber(): void {
    // Make sure coordinates are not bellow 0 or above 199
    const data = this.initialData;
    if (data.x < 0) {
      data.x = 0;
    } else if (data.x > 199) {
      data.x = 199;
    } else if (data.y < 0) {
      data.y = 0;
    } else if (data.y > 199) {
      data.y = 199;
    }
  }

  public startMission(): void {
    if (!this._helperService.loadingMission.value) {
      this._helperService.loadingMission.next(true);
      setTimeout(() => {
        // Normalize obstacle percentage
        const initialData: InitialData = Object.assign(this.initialData);
        initialData.obstacleDensity *= 400;
        // Emit initial data
        this.initialDataEmitter.emit(initialData);
        // Reset slider
        this.initialData.obstacleDensity = 1;
      }, 100);
    }
  }

}
