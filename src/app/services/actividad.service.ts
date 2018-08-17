// Creacion: TCS - Fecha: 19/07/2018 - v1.0
import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { IActividad} from "../interfaces/actividad.interface";

@Injectable()
export class ActividadService {
    constructor(private http: Http) { }
    API_ENDPOINT = 'http://localhost:56207/api/actividad';

    public listar() {
        return this.http.get(this.API_ENDPOINT);
    }
    public buscar(actividadId) {
        console.log("ActividadService.buscar");
        return this.http.get(this.API_ENDPOINT + '/' + actividadId);
    }
    public actualizar(actividad:IActividad){
        console.log("ActividadService.actualizar");
        //let body = JSON.stringify(actividad);
        let body = actividad;
        let headers = new Headers({'Content-Type':'application/json'});
        let url = `${this.API_ENDPOINT}`
        return this.http.put(url, body, { headers: headers });   
    }
    public insertar(actividad:IActividad) {
        actividad.actividadId = 0;
        actividad.estado = 1;
        const headers = new Headers({"Content-Type": "application/json"});
        var body= actividad;
        return this.http.post(this.API_ENDPOINT, body, {headers: headers});
    }
    public eliminar(actividadId) {
        return this.http.delete(this.API_ENDPOINT+'/'+actividadId);
    }
}