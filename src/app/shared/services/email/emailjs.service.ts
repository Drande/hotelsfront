import { Injectable } from '@angular/core';
import { EmailService } from './interfaces/email.service';
import emailjs from "@emailjs/browser";
import { ReservationEmailArgs } from './models/reservation-email-args';

@Injectable({
  providedIn: 'root'
})
export class EmailjsService implements EmailService {
  private readonly templates = {
    reservation: "template_h0bqirh",
  }

  private readonly serviceApi = "service_oplqwq8";
  constructor() {
    // TODO: Add key to environment
    emailjs.init('1PKUia7k2eQzIZcrC');
  }

  public async sendReservationEmail(args: ReservationEmailArgs): Promise<boolean> {
    console.log('Email sent with parameters', args);
    var result = await emailjs.send(this.serviceApi, this.templates.reservation, {
      ...args
    });
    return result.status == 200;
  }
}
