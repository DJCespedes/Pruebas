import {Injectable} from "@angular/core";
import {CanActivate} from "@angular/router";
import {AutenticacionService} from "./autenticacion.service";
@Injectable()
export class Guardian implements CanActivate {
  sesionAbierta = false;
  constructor(private autenticacionService: AutenticacionService) {
    this.sesionAbierta = this.autenticacionService.sesionAbierta();
  }
  canActivate() {
    return this.sesionAbierta;
  }
}