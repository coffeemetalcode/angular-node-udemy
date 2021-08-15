import { Component, Input } from '@angular/core';
import { ScratchService } from '../scratch/scratch.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input('ngModel')
  paramOption: string;

  constructor(private _scratchService: ScratchService) { }

  handleLoadData() {
    this._scratchService.getData(this.paramOption);
  }

}