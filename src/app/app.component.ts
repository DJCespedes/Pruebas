import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal'
import {AutenticacionService} from "./services/autenticacion.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sesionAbierta = false;
  usuario: any = null;
  result = false;
  constructor(private autenticacionService: AutenticacionService, private router: Router) {
    this.sesionAbierta = this.autenticacionService.sesionAbierta();
    this.usuario = this.autenticacionService.usuarioSesion();
  }
  cerrarSesion() {
    this.result = this.autenticacionService.cerrarSesion();
    if (this.result) {
      this.sesionAbierta = false;
      this.router.navigate(['/ingreso']);
    }

  }
}

