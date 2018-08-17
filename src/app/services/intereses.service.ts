import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class InteresesService {
    constructor(private http: Http) { }
    API_ENDPOINT = 'http://localhost:56207/api/intereses';

    public listar() {
        return this.http.get(this.API_ENDPOINT);
    }

    public buscar(interesId) {
        return this.http.get(this.API_ENDPOINT + '/' + interesId);
    }

    public insertar(interes) {
        const headers = new Headers({ "Content-Type": "application/json" });
        var body = interes;
        return this.http.post(this.API_ENDPOINT, body, { headers: headers });
    }

    public editar(interes) {
        const headers = new Headers({ "Content-Type": "application/json" });
        var body = interes;
        return this.http.put(this.API_ENDPOINT + '/' + interes.interesId, body, { headers: headers });
    }

    public eliminar(interesId) {
        return this.http.delete(this.API_ENDPOINT + '/' + interesId);
    }

}