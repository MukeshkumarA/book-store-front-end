import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent {

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { content: string }
  ) {
    console.log(data);
  }
  
  @Input() isVisible = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
    this.isVisible = false;
  }

  onCancel(): void {
    this.dialogRef.close();
    this.cancel.emit();
    this.isVisible = false;
  }
}
