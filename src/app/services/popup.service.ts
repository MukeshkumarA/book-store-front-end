import { Injectable } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupComponent } from '../components/popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  openPopup(content: string, onConfirm: () => void, onCancel:() => void): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { content },
       width: '450px'
    });

    dialogRef.componentInstance.confirm.subscribe(() => {
      onConfirm();
      dialogRef.close();
    })

    dialogRef.componentInstance.cancel.subscribe(() => {
      onCancel();
      dialogRef.close();
    })
  }

  // openPopup() {
  //   this.dialog.open(PopupComponent, {
  //     width: '400px'
  //   })
  // }
}
