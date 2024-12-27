import { Component } from '@angular/core';
import {
  GoogleSheetService,
  Sheet,
  SheetOutPut,
} from 'src/app/services/google-sheet.service';

@Component({
  selector: 'app-choose-color',
  templateUrl: './choose-color.component.html',
  styleUrls: ['./choose-color.component.scss'],
})
export class ChooseColorComponent {
  inputSheet: Sheet[] = [];

  colorCombination!: Sheet;

  isSubmitted = false;

  outPutSheet: SheetOutPut[] = [];

  showLoader = true;

  constructor(private googleSheetService: GoogleSheetService) {}

  ngOnInit() {
    this.getOutPutSheet();
    this.getInputSheet();
  }

  getOutPutSheet() {
    this.showLoader = true;
    this.googleSheetService.getOutPutSheet().subscribe((res: SheetOutPut[]) => {
      this.outPutSheet = res.map((res) => {
        res.Chosen = Number(res.Chosen);
        return res;
      });
      this.showLoader = false;
    });
  }

  getInputSheet() {
    this.isSubmitted = false;
    this.showLoader = true;

    this.googleSheetService.getInputSheet().subscribe((res) => {
      this.inputSheet = res.map((res) => {
        res.Selected = Number(res.Selected);
        return res;
      });

      this.colorCombination = this.inputSheet.reduce((prev, curr) => {
        return curr.Selected < prev.Selected ? curr : prev;
      });

      this.updateInputSheet();
    });
  }

  updateInputSheet() {
    if (this.colorCombination && Object.keys(this.colorCombination).length) {
      const request = {
        Index: this.colorCombination.Index,
        Selected: String(this.colorCombination.Selected),
        Appeared: String(Number(this.colorCombination.Appeared) + 1),
        Color1: this.colorCombination.Color1,
        Color2: this.colorCombination.Color2,
      };

      const id = this.inputSheet.findIndex(
        (input) => input.Index == this.colorCombination.Index
      );

      if (id > -1) {
        this.googleSheetService
          .updateInputSheet(id, request)
          .subscribe((res: Sheet[]) => {
            this.colorCombination = res[0];
            this.colorCombination.id = id;
            this.showLoader = false;
          });
      }
    }
  }

  buttonClick(data: Sheet, color: string) {
    const req = {
      Index: this.colorCombination.Index,
      Selected: String(Number(this.colorCombination.Selected) + 1),
      Appeared: String(this.colorCombination.Appeared),
      Color1: this.colorCombination.Color1,
      Color2: this.colorCombination.Color2,
    };
    this.showLoader = true;

    this.googleSheetService.updateInputSheet(data.id, req).subscribe(() => {
      const index = this.outPutSheet.findIndex((x) => x.Color == color);

      if (index > -1) {
        const reqData: SheetOutPut = {
          Color: this.outPutSheet[index].Color,
          Chosen: String(Number(this.outPutSheet[index].Chosen) + 1),
        };

        this.googleSheetService
          .updateOutPutSheet(index, reqData)
          .subscribe(() => {
            this.isSubmitted = true;
            this.showLoader = false;
          });
      }
    });
  }
}
