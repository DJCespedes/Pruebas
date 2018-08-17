import { Component, OnInit  } from '@angular/core';
// import {NgForm} from "@angular/forms"
import {IActividad} from "../../interfaces/actividad.interface"
import { ActividadService } from '../../services/actividad.service';
import { Router, ActivatedRoute } from '@angular/router';
import { enumRedireccionarA} from '../../shared/enumeraciones'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styles: []
})


export class ActividadComponent implements OnInit {
  actividad:IActividad = { actividadId:0, nombre: '', descripcion: '', estado:1 };
  NombreGrado = "1ero a 3ro de Primaria";
  nuevo:boolean = false;
  accion:string;

  constructor(private actividadService: ActividadService,
              private router:Router,
              private route:ActivatedRoute) {
    console.log("*****ActividadComponent - constructor*****");
    this.route.params
      .subscribe( parametros =>{ 
        console.log(parametros);
        this.actividad.gradoId = parametros['gradoId'];
        this.accion = parametros['accion']
        console.log(this.actividad.gradoId);
        if(this.accion == "actualizar"){
          this.actividad.actividadId = parametros['actividadId'];
          this.obtenerDatos(this.actividad.actividadId);
        }
      })
      //window.location.reload();
      //window.scrollTo(0, 0);
      // this.router.events.subscribe( (evt)=> {
      //   this.router.navigated = true;
      //   window.scrollTo(0, 0);
      // });   
      // this.router.events.subscribe(
      //   (event) => {
      //          console.log('sdasd');
      //   });
  }

  ngOnInit() {
    console.log('Component initialised!');
  }

  guardarActividadYRedireccionarAgrado(){
    console.log("ActividadComponent.guardarActividadYRedireccionarAgrado");
    Swal({
      title: "Se guardaran los cambios de la Actividad. ¿Desea Continuar?",
      text: "¡No podras revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
        this.guardar();
      }
    }).catch(error => { console.error("Swal:"+error)});
    
  }
  guardar(){
    console.log(this.actividad);
    if(this.accion == "actualizar")
      this.actualizarDatos(this.actividad);
    if(this.accion == "nuevo"){
      this.insertarDatos(this.actividad);
    }
  }

  
  obtenerDatos(ActividadId){
    console.log("ActividadComponent.obtenerDatos");
    this.actividadService.buscar(ActividadId)
      .subscribe((res) => {
        this.actividad = res.json();
        console.log(this.actividad);
        console.log("ActividadComponent.obtenerDatos - Correcto");
        },
        error=> {
        Swal({
          type: 'error',
          title: 'Ocurrio un error, por favor intente despues',
          showConfirmButton: false,
          timer: 1500
        }).catch(error => { console.error("Swal:"+error)});
      }
    );      
  }
  private actualizarDatos(actividad){
    console.log("GradoComponent.actualizarDatos");
    this.actividadService.actualizar(actividad)
    .subscribe((res) => {
        console.log(res);
        Swal({
          type: 'success',
          title: 'Se actualizó correctamente',
          text: "Actividad acutualizada",
          showConfirmButton: false,
          timer: 1500
        }).catch(error => { console.error("Swal:"+error)});
      },
      error=> {
      Swal({
          type: 'error',
          title: 'Ocurrio un error, por favor intente despues',
          showConfirmButton: false,
          timer: 1500
        }).catch(error => { console.error("Swal:"+error)});
      }
    );      
  }
  
  private insertarDatos(actividad){
    console.log("GradoComponent.insertarDatos");
    console.log(actividad);
    this.actividadService.insertar(actividad)
      .subscribe((res) => {
          console.log(res);
          this.actividad = res.json();
          Swal({
            type: 'success',
            title: 'Se actualizó correctamente',
            text: "Nueva actividad agregada",
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { console.error("Swal:"+error)});
          // 0 --> No sabemos el progra, lo enviamos para reconozca el formato.
          this.router.navigate(['/grado/actualizar/','0',this.actividad.gradoId]);
        },
        error=> {
        Swal({
            type: 'error',
            title: 'Ocurrio un error, por favor intente despues',
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { console.error("Swal:"+error)});
        }
      );   
  }
}
