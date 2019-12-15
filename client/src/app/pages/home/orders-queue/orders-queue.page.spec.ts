import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdersQueuePage } from './orders-queue.page';

describe('OrdersQueuePage', () => {
  let component: OrdersQueuePage;
  let fixture: ComponentFixture<OrdersQueuePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersQueuePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersQueuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
