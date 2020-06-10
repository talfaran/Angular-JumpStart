import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FilterTextboxModule } from './filter-textbox/filter-textbox.module';
import { PaginationModule } from './pagination/pagination.module';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { SortByDirective } from './directives/sortby.directive';

@NgModule({
  imports: [CommonModule, FilterTextboxModule, PaginationModule],
  exports: [
    CommonModule,
    FormsModule,
    CapitalizePipe,
    TrimPipe, SortByDirective,
    FilterTextboxModule,
    PaginationModule,
    ReactiveFormsModule
  ],
  declarations: [CapitalizePipe, TrimPipe, SortByDirective]
})
export class SharedModule { }
