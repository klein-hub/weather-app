import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="search-container">
      <mat-form-field appearance="outline">
        <mat-label>Enter city name</mat-label>
        <input matInput [(ngModel)]="searchTerm" (keyup.enter)="onSearch()">
        <button mat-icon-button matSuffix (click)="onSearch()">
          <mat-icon>search</mat-icon>
        </button>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    mat-form-field {
      width: 300px;
    }
  `]
})
export class SearchBarComponent {
  searchTerm: string = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    if (this.searchTerm.trim()) {
      this.search.emit(this.searchTerm);
    }
  }
}