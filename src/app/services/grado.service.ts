// Creacion: TCS - Fecha: 24/07/2018 - v1.0
import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { IGrado} from "../interfaces/grado.interface";

@Injectable({ providedIn: 'root'})
//@Injectable()
export class GradoService {
  constructor(private http: Http) { }
  API_ENDPOINT = 'http://localhost:56207/api/grado';

  public buscar(gradoId) {
    console.log("GradoService.buscar");
    return this.http.get(this.API_ENDPOINT + '/' + gradoId);
  }
  public listarActividades(gradoId) {
    console.log("GradoService.listarActividades");
    return this.http.get(this.API_ENDPOINT+'/ListarActividadesDelGrado/'+gradoId);
  }
  public actualizar(grado:IGrado){
      console.log("GradoService.actualizar");
      let body = grado;
      let headers = new Headers({'Content-Type':'application/json'});
      let url = `${this.API_ENDPOINT}`
      return this.http.put(url, body, { headers: headers });   
  }
  public insertar(grado:IGrado) {
    grado.gradoId = 0;
    grado.estado = 1;
    const headers = new Headers({"Content-Type": "application/json"});
    var body= grado;
    return this.http.post(this.API_ENDPOINT, body, {headers: headers});
  }
  public eliminar(gradoId) {
    console.log("GradoService.eliminar:"+gradoId);
    return this.http.delete(this.API_ENDPOINT+'/'+gradoId);
  }
}
