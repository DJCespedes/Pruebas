// Creacion: TCS - Fecha: 24/07/2018 - v1.0
import { Component, OnInit ,ViewChild, ElementRef ,NgZone } from '@angular/core';

import { IGrado } from "../../interfaces/grado.interface"
import { GradoService } from '../../services/grado.service';
import { ActividadService } from '../../services/actividad.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Tipos } from '../../shared/tipos';
import { enumRedireccionarA, enumAccion} from '../../shared/enumeraciones'
import Swal from 'sweetalert2';
import { ProgramaComponent } from '../programas/programa.component';

@Component({
  selector: 'app-grado',
  templateUrl: './grado.component.html',
  styles: []
})

export class GradoComponent implements OnInit {
  //settings$: Observable<SettingsStore>;
  grado:IGrado = { gradoId:0, nombre: '', descripcion: '', conActividades:false , estado:1};
  NombrePrograma = "Talleres y Manualidades";
  accion:string;
  tiposGrado: any = Tipos.tipoGrado;
  tableWidget: any;
  shipmentsTable: any;

  @ViewChild('divDtActividades') divDtActividades: ElementRef;
  @ViewChild('dtActividades') dtActividades: ElementRef;
  
  constructor(private gradoService: GradoService
              ,private actividadService:ActividadService
              //, private settingsService:SettingsService
              ,private router:Router
              ,private route:ActivatedRoute
              ,private _ngZone: NgZone) {
    console.log('GradoComponent.constructor');
    this.route.params
      .subscribe( parametros =>{ 
        console.log(parametros);
        this.accion = parametros['accion'];
        this.grado.programaId = parametros['programaId'];
        
        if(this.accion == "actualizar"){
          this.grado.gradoId = parametros['gradoId'];
          this.obtenerDatos(this.grado.gradoId);
        }
      })
  }

  ngOnInit() {
    this.shipmentsTable = $(this.divDtActividades.nativeElement.querySelector('table'));// $(this.dtProgramas.nativeElement.querySelector('table'));
    this.contruirDataTableActividades(this.shipmentsTable );
  }

  guardarGradoYRedireccionarAPrograma(){
    console.log("GradoComponent.guardarGradoYRedireccionarAPrograma");
    
    Swal({
      title: "Se guardaran los cambios en el Grado. ¿Desea Continuar?",
      text: "¡No podras revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
        this.guardar(enumRedireccionarA.programa);
      }
    }).catch(error => { console.error("Swal:"+error)});
  }
  
  private redireccionar(redireccion:enumRedireccionarA, actividadId?){
    console.log("GradoComponent.redireccionar:"+redireccion +" , " + actividadId);
    if(redireccion == enumRedireccionarA.programa && this.accion == enumAccion.nuevo){
      this._ngZone.run(() => {
        this.router.navigate(['/programa/actualizar',this.grado.programaId]);
      });
    }
    if(redireccion == enumRedireccionarA.actividad){
      if(actividadId)
      this._ngZone.run(() => {
        this.router.navigate(['/actividad/actualizar',this.grado.gradoId,actividadId]);
      });
      else
      this._ngZone.run(() => {
        this.router.navigate(['/actividad/nuevo',this.grado.gradoId]);
      });
    }
  }
  guardar(redireccion:enumRedireccionarA, actividadId?){
    console.log("GradoComponent.guardar");
    console.log(this.grado);
  
    if(this.accion == "actualizar")
      this.actualizarDatos(this.grado, redireccion,actividadId);
    if(this.accion == "nuevo"){
      this.insertarDatos(this.grado, redireccion);
    }
  }

  private obtenerDatos(gradoId){
    console.log("GradoComponent.obtenerDatos");
    this.gradoService.buscar(gradoId)
      .subscribe((res) => {
        this.grado = res.json();
        console.log(this.grado);
        },
        error=> {
          Swal({
            type: 'error',
            title: 'Ocurrio un error, por favor intente despues',
            text: 'No se pudo obtener el Grado',
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { console.error("Swal:"+error)});
        }
      );    
  }

  private actualizarDatos(grado,redireccion:enumRedireccionarA, actividadId?){
    console.log("GradoComponent.actualizarDatos");
    this.gradoService.actualizar(grado)
    .subscribe((res) => {
        console.log(res);
        Swal({
          type: 'success',
          title: 'Se actualizó correctamente',
          text: "Grado actualizado",
          showConfirmButton: false,
          timer: 1500
        }).catch(error => { console.error("Swal:"+error)});
        this.redireccionar(redireccion,actividadId);
      },
      error=> {
      Swal({
          type: 'error',
          title: 'Ocurrio un error, por favor intente despues',
          text: "No se pudo actualizar grado",
          showConfirmButton: false,
          timer: 1500
        }).catch(error => { console.error("Swal:"+error)});
      }
    );   
  }

  private insertarDatos(grado, redireccion:enumRedireccionarA){
    console.log("GradoComponent.insertarDatos");
    this.gradoService.insertar(grado)
      .subscribe((res) => {
          console.log(res);
          this.grado = res.json();
          Swal({
            type: 'success',
            title: 'Se actualizó correctamente',
            text: "Nuevo grado agregado",
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { console.error("Swal:"+error)});
          this.redireccionar(redireccion);
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

  agregarActividad(){
    Swal({
      title: "Se guardaran los cambios del Grupo. ¿Desea Continuar?",
      text: "¡No podras revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
        this.guardar(enumRedireccionarA.actividad);
      }
    }).catch(error => { console.error("Swal:"+error)});
  }

  ver(cadena) {
    var cadenaDeco = decodeURI(cadena);
    var cadenaJson = JSON.parse(cadenaDeco);
  }


  contruirDataTableActividades(dtActividades: ElementRef) {
    console.log('GradoComponent.contruirDataTableActividades');
    if (this.tableWidget) {
      this.tableWidget.ajax.reload();
    }
    else {
      let optActividades: any = {
        ajax: (dataTablesParameters: any, callback) => {
          this.gradoService.listarActividades(this.grado.gradoId).subscribe((data) => {
            console.log(data.json());
            callback({
              recordsTotal: data.json().length,
              recordsFiltered: data.json().length,
              data: data.json()
            });
          }), err => {
            Swal({
              position: 'right-end',
              type: 'error',
              title: err,
              showConfirmButton: false,
              timer: 1500
            }).catch(error => { });
          };
        },
        columns: [{
          title: "#",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          title: 'Nombre',
          data: 'nombre',
          width: "35%"
        }, {
          title: 'Descripción',
          data: 'descripcion',
          width: "50%"
        }, {
          render: function (data, type, actividad, meta) {
            //var cadena = encodeURI(JSON.stringify(programa));
            var btn = '<button type="button" class="btn btn-primary btn-sm" '
            btn += 'onclick="functions.editar(' + actividad.actividadId + ')">'
            btn += '<i class="fa fa-edit">&nbsp;</i>Editar'
            btn += '</button>';
            return btn;
          },
          width: "5%"
        }, {
          render: function (data, type, actividad, meta) {
            var btn = '<button type="button" class="btn btn-danger btn-sm"'
            btn += 'onclick="functions.eliminar(' + actividad.actividadId + ')">'
            btn += '<i class="fa fa-trash-o">&nbsp;</i>Eliminar'
            btn += '</button>';
            return btn;
          },
          width: "5%"
        }],
        select: false,
        bSort: false,
        pageLength: 5,
        language: { url: "./../assets/Spanish.js" },
        dom: 'Bfrtip',
        buttons: []
      };

      window.functions = window.functions || {};
      window.functions.editar = this.editarActividad.bind(this);
      window.functions.eliminar = this.eliminarActividad.bind(this);
      //this.shipmentsTable = $(divDtActividades.nativeElement.querySelector('table'));// $(this.dtProgramas.nativeElement.querySelector('table'));
      this.tableWidget = $(dtActividades).DataTable(optActividades);
      
      //this.tableWidget = this.shipmentsTable.DataTable(optActividades);

      console.log('GradoComponent.contruirDataTableActividades - Fin');
    }
  }

  editarActividad(actividadId) {
    Swal({
      title: "Se guardaran los cambios del Grupo. ¿Desea Continuar?",
      text: "¡No podras revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
        this.guardar(enumRedireccionarA.actividad,actividadId);
      }
    }).catch(error => { console.error("Swal:"+error)});
  }
  
  eliminarActividad(actividadId) {
    Swal({
      title: '¿Estás seguro de eliminar el Programa?',
      text: "¡No podrás revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
          this.actividadService.eliminar(actividadId).subscribe((res) => {
          this.shipmentsTable = $(this.divDtActividades.nativeElement.querySelector('table'));
          this.contruirDataTableActividades(this.shipmentsTable );
          Swal({
            position: 'right-end',
            type: 'success',
            title: 'Se Elimino con exito',
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { });
        }), err => {
        };
      }
    }).catch(error => { });
  }
}
