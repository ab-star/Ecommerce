import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() totalItems: number = 0;
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 4;
  @Input() pageSizeOptions: number[] = [4, 10, 15];
  @Input() pageSizeDisabled: boolean = false;  // New Input for disabling the dropdown

  @Output() pageChanged: EventEmitter<{ pageIndex: number, pageSize: number }> = new EventEmitter();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPreviousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.emitPageChange();
    }
  }

  onNextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.emitPageChange();
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.pageIndex = 0;  // Reset to first page on page size change
    this.emitPageChange();
  }

  private emitPageChange(): void {
    this.pageChanged.emit({ pageIndex: this.pageIndex, pageSize: this.pageSize });
  }
}
