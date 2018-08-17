import {Injectable} from "@angular/core";
@Injectable()
export class AutenticacionService {

  public iniciarSesion(matricula: string, contrasenhia: string) {
    sessionStorage.setItem('sessionAbierta', '1');
    sessionStorage.setItem('usuario', matricula + ' - Octavio Bedregal Flores');
    return true;
  }

  public cerrarSesion() {
    sessionStorage.removeItem('sessionAbierta');
    sessionStorage.removeItem('usuario');
    return true;
  }

  public sesionAbierta() {
    return (sessionStorage.getItem('sessionAbierta') === '1' ? true : false);
  }

  public usuarioSesion() {
    return sessionStorage.getItem('usuario');
  }
}