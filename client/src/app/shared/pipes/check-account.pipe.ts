import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '../interfaces';

@Pipe({
  name: 'checkAccount'
})
export class CheckAccountPipe implements PipeTransform {

  transform(accountId: number | string, accounts: Account[]): string {
    const foundAccount = accounts.find(acc => acc.id === accountId);
    return !!foundAccount ? foundAccount.title : ' (этот счет был удален)';
  }
}
