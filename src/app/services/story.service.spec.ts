import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoryService } from './story.service';
import { PagedResult } from '../models/page-result.model';
import { Story } from '../models/story.model';

describe('StoryService', () => {
  let service: StoryService;
  let httpMock: HttpTestingController;

  const mockResponse: PagedResult<Story> = {
    items: [
      { id: 1, title: 'Story One', url: 'http://story1.com' },
      { id: 2, title: 'Story Two', url: 'http://story2.com' }
    ] as Story[],
    totalCount: 2
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import the HttpClientTestingModule
      providers: [StoryService]
    });

    service = TestBed.inject(StoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stories successfully from API', () => {
    const page = 1;
    const pageSize = 10;
    const searchTerm = '';

    service.getStories(page, pageSize, searchTerm).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      expect(data.items.length).toBe(2);
      expect(data.totalCount).toBe(2);
    });

    // Expecting a POST request to be made with the correct API URL
    const req = httpMock.expectOne('https://localhost:7273/api/news/getNewStories');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      pageNumber: page,
      pageSize: pageSize,
      searchTerm: searchTerm
    });

    // Mock the response
    req.flush(mockResponse);
  });

  it('should handle HTTP error gracefully', () => {
    const page = 1;
    const pageSize = 10;
    const searchTerm = 'Angular';

    service.getStories(page, pageSize, searchTerm).subscribe({
      next: () => fail('should have failed with a 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne('https://localhost:7273/api/news/getNewStories');
    req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error' });
  });
});
