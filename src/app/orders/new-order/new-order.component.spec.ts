import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { NewOrderComponent } from './new-order.component';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { MockDataService, MockRouterrService, MockLoggerService, MockelementrefService, MockModalService } from 'src/app/shared/mocks';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/core/services/logger.service';
import { ModalService } from 'src/app/core/modal/modal.service';
import { By } from '@angular/platform-browser';
import { exportAllDeclaration, jsxExpressionContainer } from '@babel/types';
import { SpyNgModuleFactoryLoader } from '@angular/router/testing';
import { throwError, of } from 'rxjs';

describe('NewOrderComponent', () => {
  let component: NewOrderComponent;
  let fixture: ComponentFixture<NewOrderComponent>;
  let DDPanel: ElementRef;
  let form: FormGroup;
  let dataService;
  let logger: LoggerService;
  let router: Router;
  const firstCustomer = {
    'id': 1,
    'firstName': 'ted',
    'lastName': 'james',
    'gender': 'male',
    'address': '1234 Anywhere St.',
    'city': ' Phoenix ',
    'state': {
      'abbreviation': 'AZ',
      'name': 'Arizona'
    },
    'orders': [
      { 'productName': 'Basketball', 'itemCost': 7.99 },
      { 'productName': 'Shoes', 'itemCost': 199.99 }
    ],
    'latitude': 33.299,
    'longitude': -111.963
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewOrderComponent],
      providers: [
        FormBuilder,
        { provide: DataService, useClass: MockDataService },
        { provide: ElementRef, useClass: MockelementrefService },
        { provide: Router, useClass: MockRouterrService },
        { provide: LoggerService, useClass: MockLoggerService },
        { provide: ModalService, useClass: MockModalService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dataService = fixture.debugElement.injector.get(DataService);
    router = fixture.debugElement.injector.get(Router);
    logger = fixture.debugElement.injector.get(LoggerService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate with form without orders', () => {
    expect((<FormArray>component.form.get('orders')).controls.length).toBe(0);
  });

  it('should test open/close panel functionallity', () => {
    expect(component.isDropdownPanelOpen).toBeFalsy();
    component.openPanel();
    expect(component.isDropdownPanelOpen).toBeTruthy();
    component.closePanel();
    expect(component.isDropdownPanelOpen).toBeFalsy();
  });

  it('should test panel actually appear in the the dom', fakeAsync(() => {
    DDPanel = fixture.debugElement.query(By.css('.dropdown-panel'));
    expect(DDPanel).toBeFalsy();
    component.openPanel();
    fixture.detectChanges();
    DDPanel = fixture.debugElement.query(By.css('.dropdown-panel'));
    expect(DDPanel.nativeElement).toBeTruthy();
  }));

  describe('selection of customer', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(NewOrderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      form = component.form;
    });

    it('should test the display and selection of customers', () => {
      component.openPanel();
      spyOn(component, 'closePanel');
      spyOn(component, 'onOptionClicked').and.callThrough();
      const setValue = spyOn(component.form.get('customer'), 'setValue').and.callThrough();
      fixture.detectChanges();
      DDPanel = fixture.debugElement.query(By.css('.dropdown-panel'));
      const options = DDPanel.nativeElement.querySelectorAll(':scope > div');
      expect(options.length).toBe(22);
      options[0].click();
      fixture.detectChanges();
      expect(component.onOptionClicked).toHaveBeenCalled();
      expect(component.form.get('customer').value).toEqual(firstCustomer);

      // adding the same customer twice should not be an option:

      component.openPanel();
      fixture.detectChanges();
      options[0].click();
      fixture.detectChanges();
      expect(component.closePanel).toHaveBeenCalledTimes(2);
      expect(setValue).toHaveBeenCalledTimes(1);
    });

    it('should test add order functionality', () => {
     const formArr: FormArray = component.formArr;
      expect(form.get('customer').valid).toBeFalsy();
      spyOn(component, 'addOrder').and.callThrough();
      const disabled = fixture.debugElement.queryAll(By.css('.disabled'));
      expect(disabled.length).toBe(1);
      form.get('customer').setValue(firstCustomer);
      expect(form.get('customer').valid).toBeTruthy();
      for (let i = 0; i < 10; i++) {
        component.addOrder();
      }
      expect(formArr.length).toBe(5);
      while (formArr.length !== 0) {
        formArr.removeAt(0);
      }
      expect(formArr.length).toBe(0);
      component.addOrder();
      expect(form.get('customer').valid).toBeTruthy();
      expect(form.get('orders').valid).toBeFalsy();
      formArr.controls[0].get('productName').setValue('justAName');
      formArr.controls[0].get('itemCost').setValue('123');
      expect(form.valid).toBeTruthy();
      formArr.controls[0].get('itemCost').setValue('ert');
      expect(form.valid).toBeFalsy();
    });

    it('should test remove order functionality', () => {
      component.addOrder();
      expect(component.formArr.length).toBe(1);
      component.removeOrder(0);
      expect(component.formArr.length).toBe(0);
    })

    it('should test the submitForm functionality', fakeAsync(() => {
       spyOn(component, 'submitOrder').and.callThrough();
       spyOn(router, 'navigateByUrl');
       spyOn(logger, 'log');
      const spyOfAddOrderToCustomer = spyOn(dataService, 'addOrdersToCustomer').and.callThrough();
       expect(form.valid).toBeFalsy();
       expect(component.form).toBeTruthy();
       component.submitOrder();
       expect(dataService.addOrdersToCustomer).not.toHaveBeenCalled();
      form.get('customer').setValue(firstCustomer);
      component.addOrder();
      component.formArr.controls[0].get('productName').setValue('justAName');
      component.formArr.controls[0].get('itemCost').setValue('123');
      component.submitOrder();
      expect(dataService.addOrdersToCustomer).toHaveBeenCalledWith({
        customer: 1,
        orders: [
          {productName: 'justAName', itemCost: 123}
        ]
      });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/orders');
      spyOfAddOrderToCustomer.and.callFake(() => {
        return throwError(new Error());
      });
      component.submitOrder();
      expect(logger.log).toHaveBeenCalled();

    }));

  });


});
