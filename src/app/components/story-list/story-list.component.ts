import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../services/story.service';
import { Story } from '../../models/story.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Add NgFor and NgIf here
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})

export class StoryListComponent implements OnInit {
  stories: Story[] = [];
  page = 1;
  pageSize = 10;
  totalCount = 0;
  loading = false;
  searchTerm = '';

 
  constructor(private storyService: StoryService) {}

  ngOnInit() {
    this.loadStories();
  }
  
  onSearch() {
    this.page = 1;
    this.loadStories(); // Apply search filter in loadStories
  }
  
  clearSearch() {
    this.searchTerm = '';
    this.page = 1;
    this.loadStories(); // Reload without search filter
  }
  

  loadStories() {
    this.loading = true;
    this.storyService.getStories(this.page, this.pageSize, this.searchTerm).subscribe(result => {
      this.stories = result.items;
      this.totalCount = result.totalCount;
      this.loading = false;
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadStories();
  }
}
