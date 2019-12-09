import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderCreationPage } from './order-creation.page';

describe('OrderCreationPage', () => {
  let component: OrderCreationPage;
  let fixture: ComponentFixture<OrderCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCreationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
