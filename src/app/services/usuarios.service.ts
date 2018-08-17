import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class UsuariosService {
    constructor(private http: Http) { }
    API_ENDPOINT = 'http://localhost:56207/api/usuario';

    public listar() {
        return this.http.get(this.API_ENDPOINT);
    }

    public buscar(usuarioId) {
        return this.http.get(this.API_ENDPOINT + '/' + usuarioId);
    }

    public editar(usuario) {
        const headers = new Headers({ "Content-Type": "application/json" });
        var body = usuario;
        return this.http.put(this.API_ENDPOINT + '/' + usuario.usuarioId, body, { headers: headers });
    }
    public generarPassword(dni:string){
        console.log(this.API_ENDPOINT+ '/GenerarPassword/'+ dni);
        return this.http.head(this.API_ENDPOINT+ '/GenerarPassword/'+ dni);
    }

    public enviarCorreo(correo) {
        console.log(this.API_ENDPOINT + '/EnviarCorreod/' + correo);
        const body = correo;
        return this.http.put(this.API_ENDPOINT + '/EnviarCorreo/', body);
    }

}