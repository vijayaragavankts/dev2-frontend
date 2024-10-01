import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DueBillsComponent } from './components/due-bills/due-bills.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { AuthGuard } from './auth/auth.guard';
import { AccountComponent } from './components/account/account.component';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { CardComponent } from './components/card/card.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'due-bills',
        component: DueBillsComponent,
      },
      {
        path: 'payment-history',
        component: TransactionComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'payment-gateway',
        component: PaymentGatewayComponent,
      },
      {
        path: 'payments/card',
        component: CardComponent,
      },
      {
        path: 'payments/wallet',
        component: WalletComponent,
      },
      {
        path:'paybill',
        component: PaymentComponent
      }
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
