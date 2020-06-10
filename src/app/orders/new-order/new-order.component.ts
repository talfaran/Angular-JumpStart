import { Component, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { ICustomer } from 'src/app/shared/interfaces';
import { Observable, fromEvent, concat } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter, map, tap } from 'rxjs/operators';
import { customers } from 'src/app/shared/mocks';
import { noop } from '@angular/compiler/src/render3/view/util';
import { CustomValidatorsService } from 'src/app/shared/services/custom-validators.service';
import { IModalContent, ModalService } from 'src/app/core/modal/modal.service';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'cm-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  formArr: FormArray;
  ordersEnum = {
    0: 'first',
    1: 'second',
    2: 'third',
    3: 'forth',
    4: 'fifth'
  };
  InitialCustomers$: Observable<ICustomer[]>;
  filteredCustomers$: Observable<ICustomer[]>;
  finalCustomers$: Observable<ICustomer[]>;;
  isDropdownPanelOpen = false;
  @ViewChild('autocomplete') autoCompleteInput: ElementRef;
  constructor(
    private fb: FormBuilder,
    private elref: ElementRef,
    private dataService: DataService,
    private customValidators: CustomValidatorsService,
    private modalService: ModalService,
    private router: Router,
    private logger: LoggerService

  ) {
    this.form = this.fb.group({
      customer: ['', [Validators.required, this.customValidators.pickedFromList.bind(this)]],
      orders: this.fb.array([])
    });

    this.formArr = this.form.get('orders') as FormArray;
  }
  @HostListener('window:click', ['$event'])
  public closeWindow(event) {
    if (this.elref.nativeElement.contains(event.target)) { return; }
    this.closePanel();
  }

  ngOnInit(): void {
    this.InitialCustomers$ = this.dataService.getCustomers();
    this.filteredCustomers$ = this.InitialCustomers$.pipe(
      map((_customers) => {
        const search = this.form.get('customer').value.toLowerCase();
        return _customers.filter(customer => `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search));
      }
      ));
  }

  ngAfterViewInit() {
    const searchCusomers$ = fromEvent(this.autoCompleteInput.nativeElement, 'keyup').pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(() => this.filteredCustomers$)
    );

    this.finalCustomers$ = concat(this.InitialCustomers$, searchCusomers$);
  }

  openPanel() {
    this.isDropdownPanelOpen = true;
  }

  closePanel() {
    this.isDropdownPanelOpen = false;
  }

  addOrder() {
    if (this.formArr.length >= 5) { return; }

    const order = this.fb.group({
      productName: ['', [Validators.required]],
      itemCost: ['', [Validators.required, Validators.pattern('[0-9]*[.]?[0-9]*')]]
    });
    this.formArr.push(order);
  }

  removeOrder(i) {
    this.formArr.removeAt(i);
  }

  onOptionClicked(customer: ICustomer) {
    const formCustomer = this.form.value.customer;
    if (formCustomer && formCustomer.id && formCustomer.id === customer.id) {
      this.closePanel();
      return;
    }
    this.form.get('customer').setValue(customer);
    this.closePanel();
  }

  submitOrder() {
    if (!this.form.valid) { return; }
    this.form.value.orders.map((order) => {
      order.itemCost = +order.itemCost;
      return order;
    });
    this.form.get('customer').setValue(this.form.get('customer').value.id);
    console.log(this.form.value);
    this.dataService.addOrdersToCustomer(this.form.value).subscribe(() => {
      this.form.markAsPristine();
      this.router.navigateByUrl('/orders');
    },
      err => this.logger.log(err));
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (!this.form.dirty) {
      return true;
    }

    // Dirty show display modal dialog to user to confirm leaving
    const modalContent: IModalContent = {
      header: 'Lose Unsaved Changes?',
      body: 'You have unsaved changes! Would you like to leave the page and lose them?',
      cancelButtonText: 'Cancel',
      OKButtonText: 'Leave'
    };
    return this.modalService.show(modalContent);
  }

}
