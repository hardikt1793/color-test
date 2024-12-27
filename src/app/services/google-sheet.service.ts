import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Sheet {
  id?: string | number;
  Index: string;
  Selected: string | number;
  Appeared: string | number;
  Color1: string;
  Color2: string;
}

export interface SheetOutPut {
  Color: string;
  Chosen: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetService {
  constructor(private http: HttpClient) {}

  getInputSheet():Observable<Sheet[]> {
    return this.http.get<Sheet[]>(`${environment.URL}`);
  }

  updateInputSheet(id:any, reqBody: Sheet): Observable<Sheet[]> {
    return this.http.put<Sheet[]>(`${environment.URL}/${id}`, reqBody);
  }

  updateOutPutSheet(id:any, reqBody: SheetOutPut): Observable<SheetOutPut[]> {
    return this.http.put<SheetOutPut[]>(`${environment.URL}/tabs/Output/${id}`, reqBody);
  }

  getOutPutSheet(): Observable<SheetOutPut[]> {
    return this.http.get<SheetOutPut[]>(`${environment.URL}/tabs/Output`);
  }
}
