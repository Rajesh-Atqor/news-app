import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/page-result.model';
import { Story } from '../models/story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private apiUrl = 'https://newsappapi-ara6cma2b8crddgy.centralindia-01.azurewebsites.net/api/';

  constructor(private http: HttpClient) {}

  getStories(page: number, pageSize: number, searchTerm: string): Observable<PagedResult<Story>> {
    const body = {
      pageNumber: page,
      pageSize: pageSize,
      searchTerm : searchTerm
    };
  
    return this.http.post<PagedResult<Story>>(this.apiUrl + 'news/getNewStories', body);
  }
  
  
  
}
