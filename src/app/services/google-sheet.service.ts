import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Sheet } from "../models/sheet.model";
import { SheetOutput } from "../models/sheet-output.model";

@Injectable({
  providedIn: "root",
})
export class GoogleSheetService {
  constructor(private http: HttpClient) {}

  /**
   * Get the input sheet details.
   * @returns input sheet
   */
  getInputSheet(): Observable<Sheet[]> {
    return this.http.get<Sheet[]>(`${environment.URL}`);
  }

  /**
   * To update the input sheet with the payload details.
   * @param id - sheet id
   * @param reqBody - details to be updated.
   * @returns
   */
  updateInputSheet(id: number, reqBody: Sheet): Observable<Sheet[]> {
    return this.http.put<Sheet[]>(`${environment.URL}/${id}`, reqBody);
  }

  /**
   * To update the output sheet with the payload details.
   * @param id - sheet id
   * @param reqBody - details to be updated.
   * @returns
   */
  updateOutputSheet(
    id: number,
    reqBody: SheetOutput
  ): Observable<SheetOutput[]> {
    return this.http.put<SheetOutput[]>(
      `${environment.URL}/tabs/Output/${id}`,
      reqBody
    );
  }

  /**
   * Get the output sheet details.
   * @returns output sheet
   */
  getOutputSheet(): Observable<SheetOutput[]> {
    return this.http.get<SheetOutput[]>(`${environment.URL}/tabs/Output`);
  }
}
