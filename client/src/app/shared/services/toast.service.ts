import { Injectable, TemplateRef } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  template: TemplateRef<any>;

  constructor(private notifications: NotificationsService) {}

  setTemplate(template: TemplateRef<any>) {
    this.template = template;
  }

  show(type: 'success' | 'info' | 'alert' | 'warn' | 'error', message: string) {
        
        let icon = '';
        let title = '';
        switch (type) {
          case 'success':
            icon = 'far fa-check-circle';
            title = "Успешно";
            break;

          case 'error':
            title = "Произошла ошибка";
            icon = 'fas fa-exclamation-circle';
            break;

          case 'info':
            title = "Информация";
            icon = 'fas fa-info';
            break;

          case 'warn':
            title = "Внимание";
            icon = 'fas fa-exclamation-triangle';
            break;

          case 'alert':
            title = "Уведомление";
            icon = 'far fa-bell'
            break;
        }

        const typeStr = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
        this.notifications.html(this.template, null, null, null,
          {
            title,
            message,
            indicator: type,
            icon
          });
  }
}
