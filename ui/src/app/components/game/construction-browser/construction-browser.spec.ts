import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionBrowser } from './construction-browser';

describe('ConstructionBrowser', () => {
  let component: ConstructionBrowser;
  let fixture: ComponentFixture<ConstructionBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructionBrowser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructionBrowser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
