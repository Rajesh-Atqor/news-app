import { Routes } from '@angular/router';
import { StoryListComponent } from './components/story-list/story-list.component';

export const routes: Routes = [
    {
      path: '',
      component: StoryListComponent
    },
    {
      path: 'stories',
      loadComponent: () => import('./components/story-list/story-list.component').then(m => m.StoryListComponent)
    }
  ];
