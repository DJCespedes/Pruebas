// Creacion: TCS - Fecha: 19/07/2018 - v1.0
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AutenticacionService} from '../../services/autenticacion.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html'
})
export class IngresoComponent {
  captchas = false;
  usuario = {matricula: 'S78660', contrasenhia: 'S78660'};
  error = '';
  constructor(
    private router: Router,
    private autenticacionService: AutenticacionService) {}

  handleSuccess(captchaResponse: string) {
      console.log(`Resolved captcha with response ${captchaResponse}:`);
      this.captchas = true;
   }

  loginParams = null;
  ingresoParams: any = {};
  loggedIn = true;
  loggedUser = null;

  iniciarSesion() {

    /*
    if(!this.captchas)
    {
      this.error = 'Captchas incorrecto';
      return;
    }*/
    var result = this.autenticacionService.iniciarSesion(this.usuario.matricula, this.usuario.contrasenhia);
    if (result === true) {
      //this.router.navigate(['/']);
      window.location.href = '/';
    } else {
      this.error = 'Credenciales incorrectas';
    }
  }
}