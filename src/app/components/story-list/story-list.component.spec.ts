import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StoryListComponent } from './story-list.component';
import { StoryService } from '../../services/story.service';
import { Story } from '../../models/story.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let mockStoryService: jasmine.SpyObj<StoryService>;

  const mockResponse = {
    items: [
      { id: 1, title: 'Story One', url: 'http://story1.com' },
      { id: 2, title: 'Story Two', url: 'http://story2.com' }
    ] as Story[],
    totalCount: 2
  };

  beforeEach(async () => {
    mockStoryService = jasmine.createSpyObj('StoryService', ['getStories']);
    mockStoryService.getStories.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [StoryListComponent, CommonModule, FormsModule],
      providers: [{ provide: StoryService, useValue: mockStoryService }]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadStories on init', () => {
    expect(mockStoryService.getStories).toHaveBeenCalledWith(1, 10, '');
    expect(component.stories.length).toBe(2);
    expect(component.totalCount).toBe(2);
  });

  it('should call loadStories when onSearch is triggered', () => {
    component.searchTerm = 'Angular';
    component.onSearch();
    expect(component.page).toBe(1);
    expect(mockStoryService.getStories).toHaveBeenCalledWith(1, 10, 'Angular');
  });

  it('should clear search term and reset page on clearSearch', () => {
    component.searchTerm = 'Angular';
    component.clearSearch();
    expect(component.searchTerm).toBe('');
    expect(component.page).toBe(1);
    expect(mockStoryService.getStories).toHaveBeenCalledWith(1, 10, '');
  });

  it('should change page and reload stories on onPageChange', () => {
    component.onPageChange(3);
    expect(component.page).toBe(3);
    expect(mockStoryService.getStories).toHaveBeenCalledWith(3, 10, '');
  });

  it('should set loading to true when loadStories starts and false when done', () => {
    component.loading = false;
    component.loadStories();
    expect(component.loading).toBe(false); // because observable finishes instantly in test
  });
});
