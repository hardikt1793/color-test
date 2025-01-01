import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { SheetOutput } from "src/app/models/sheet-output.model";
import { Sheet } from "src/app/models/sheet.model";
import { GoogleSheetService } from "src/app/services/google-sheet.service";
@Component({
  selector: "app-choose-color",
  templateUrl: "./choose-color.component.html",
  styleUrls: ["./choose-color.component.scss"],
})
export class ChooseColorComponent implements OnInit, OnDestroy {
  // to hold the input sheet details
  inputSheet: Sheet[] = [];

  // the color combination to be shown
  colorCombination!: Sheet;

  // flag to identify the details are submitted or not
  isSubmitted = false;

  // to hold the output sheet details
  outputSheet: SheetOutput[] = [];

  // to show/hide the loader, initially set to false
  isShowLoader = false;

  // Subject to signal the component destruction
  private destroy$ = new Subject<void>();

  constructor(private googleSheetService: GoogleSheetService) {}

  ngOnInit() {
    this.getOutputSheet();
    this.getInputSheet();
  }

  /**
   * Get the output sheet details.
   */
  getOutputSheet(): void {
    this.isShowLoader = true;
    this.googleSheetService
      .getOutputSheet()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: SheetOutput[]) => {
          this.outputSheet = res.map((res) => {
            res.Chosen = Number(res.Chosen);
            return res;
          });
          this.isShowLoader = false;
        },
        error: (error) => {
          this.isShowLoader = false;
          console.error("Error fetching output sheet:", error);
        },
      });
  }

  /**
   * Get the input sheet details.
   */
  getInputSheet(): void {
    this.isSubmitted = false;
    this.isShowLoader = true;

    this.googleSheetService
      .getInputSheet()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.inputSheet = res.map((res) => {
            res.Selected = Number(res.Selected);
            return res;
          });

          this.colorCombination = this.inputSheet.reduce((prev, curr) => {
            return curr.Selected < prev.Selected ? curr : prev;
          });

          this.updateInputSheet();
        },
        error: (error) => {
          this.isShowLoader = false;
          console.error("Error fetching input sheet:", error);
        },
      });
  }

  /**
   * TO update the input sheet.
   */
  updateInputSheet(): void {
    if (this.colorCombination && Object.keys(this.colorCombination).length) {
      const request: Sheet = {
        Index: this.colorCombination.Index,
        Selected: String(this.colorCombination.Selected),
        Appeared: String(Number(this.colorCombination.Appeared) + 1),
        Color1: this.colorCombination.Color1,
        Color2: this.colorCombination.Color2,
      };

      const id = this.inputSheet.findIndex(
        (input) => input.Index === this.colorCombination.Index
      );

      if (id > -1) {
        this.googleSheetService
          .updateInputSheet(id, request)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: Sheet[]) => {
              this.colorCombination = res[0];
              this.colorCombination.id = id;
              this.isShowLoader = false;
            },
            error: (error) => {
              this.isShowLoader = false;
              console.error("Error updating input sheet:", error);
            },
          });
      }
    }
  }

  /**
   * Updating the input and out sheet on color selection.
   * @param color - the color selected among the pair
   */
  updateInputOutputSheet(color: string): void {
    const req: Sheet = {
      Index: this.colorCombination.Index,
      Selected: String(Number(this.colorCombination.Selected) + 1),
      Appeared: String(this.colorCombination.Appeared),
      Color1: this.colorCombination.Color1,
      Color2: this.colorCombination.Color2,
    };
    this.isShowLoader = true;
    this.googleSheetService
      .updateInputSheet(Number(this.colorCombination.id), req)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const index = this.outputSheet.findIndex((x) => x.Color == color);

          if (index > -1) {
            const reqData: SheetOutput = {
              Color: this.outputSheet[index].Color,
              Chosen: String(Number(this.outputSheet[index].Chosen) + 1),
            };

            this.googleSheetService
              .updateOutputSheet(index, reqData)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.isSubmitted = true;
                  this.isShowLoader = false;
                },
                error: (error) => {
                  this.isShowLoader = false;
                  console.error("Error updating output sheet:", error);
                },
              });
          }
        },
        error: (error) => {
          this.isShowLoader = false;
          console.error("Error updating input sheet:", error);
        },
      });
  }

  /**
   * Implement OnDestroy to clean up subscriptions.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
