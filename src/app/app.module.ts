import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from './material.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MainlistComponent} from './mainlist/mainlist.component';
import { MessageComponent} from './message/message.component';
import { TestComponent } from './test/test.component'
import { SinchService } from './sinch.service'
import { LocalStorageService } from './services/localstorage.service'
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DialerComponent } from './dialer/dialer.component';
import { CallingService } from './services/calling.service';
import { AccountModule } from './database/account/account.module';
import { HistoryModule } from './database/history/history.module';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactComponent } from './contact-list/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    SidenavComponent,
    MainlistComponent,
    MessageComponent,
    TestComponent,
    AccountSettingsComponent,
    DialerComponent,
    ContactListComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule.forRoot([{
      path: '',
      component: MainlistComponent
    },
    {
      path: 'contacts',
      component: ContactListComponent
    }
    
    ])
  ],
  entryComponents: [
    AccountSettingsComponent,
    DialerComponent
  ],
  providers: [LocalStorageService, SinchService, CallingService, AccountModule, HistoryModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
