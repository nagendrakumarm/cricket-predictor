import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-dialog',
  imports: [MatProgressSpinnerModule, MatDialogModule, CommonModule],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.css',
})
export class LoadingDialogComponent {}
