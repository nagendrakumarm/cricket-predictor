import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private dialogRef: MatDialogRef<LoadingDialogComponent> | null = null;

  constructor(private dialog: MatDialog) {}

  show() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(LoadingDialogComponent, {
        disableClose: true,
        panelClass: 'loading-dialog-panel',
        backdropClass: 'loading-backdrop'
      });
    }
  }

  hide() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}