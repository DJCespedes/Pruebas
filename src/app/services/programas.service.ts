import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { IPrograma } from "../interfaces/programa.interface";

@Injectable()
export class ProgramasService {
  constructor(private http: Http) {}
  API_ENDPOINT = 'http://localhost:56207/api/programa';
  public listar() {
    console.log("ProgramasService.listar");
    return this.http.get(this.API_ENDPOINT);
  }
  public listarGrados(programaId) {
    console.log("ProgramasService.listarGrados");
    return this.http.get(this.API_ENDPOINT+'/listargradosdelprograma/'+programaId);
  }
  public actualizar(programa: IPrograma){
    console.log("ProgramasService.actualizar");
    let body = programa;
    let headers = new Headers({'Content-Type':'application/json'});
    return this.http.put(this.API_ENDPOINT, body, { headers: headers });   
  }
  public buscar(programaId) {
    console.log("ProgramasService.buscar");
    console.log(this.API_ENDPOINT+'/'+programaId);
    return this.http.get(this.API_ENDPOINT+'/'+programaId);
  }
  public insertar(programa: IPrograma) {
    console.log("ProgramasService.insertar");
    const headers = new Headers({"Content-Type": "application/json"});
    var body= programa;
    return this.http.post(this.API_ENDPOINT, body, {headers: headers});
  }
  public editar(programa) {
    console.log("ProgramasService.editar");
    const headers = new Headers({"Content-Type": "application/json"});
    var body= programa;
    return this.http.put(this.API_ENDPOINT, body, {headers: headers});
  }
  public eliminar(programaId) {
    console.log("ProgramasService.eliminar");
    return this.http.delete(this.API_ENDPOINT+'/'+programaId);
  }
}