import { Component, OnInit, ViewChild, ElementRef,NgZone } from '@angular/core';

import { IPrograma } from "../../interfaces/programa.interface"
import { Tipos } from '../../shared/tipos';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProgramasService } from "../../services/programas.service";
import { GradoService } from '../../services/grado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { enumRedireccionarA, enumAccion} from '../../shared/enumeraciones'
import Swal from 'sweetalert2';

@Component({
    selector: 'app-programa',
    templateUrl: './programa.component.html'
})

export class ProgramaComponent implements OnInit {
  programa:IPrograma = { programaId:0, nombre: '', descripcion: '', conGrados:false , estado:1};
  tiposPrograma: any = Tipos.tipoPrograma;
  accion:enumAccion;
  tableWidgetGrados: any;

  @ViewChild('divDtGrados') divDtGrados: ElementRef;
  @ViewChild('dtGrados') dtGrados: ElementRef;

  constructor(private programaService: ProgramasService
          ,private gradoService: GradoService
          ,private router:Router
          ,private route:ActivatedRoute
          ,private _ngZone: NgZone) {
      console.log("*****ProgramaComponent - constructor*****");
      this.route.params
      .subscribe( parametros =>{ 
          console.log(parametros);
          this.accion = parametros['accion'];
          if(this.accion == enumAccion.actualizar){
              this.programa.programaId = parametros['programaId'];
              console.log(this.programa.programaId);
              this.obtenerDatosPrograma(this.programa.programaId);
          }
      })
  }
    
  ngOnInit(): void {
    console.log("ProgramaComponent.ngOnInit");
    this.tableWidgetGrados = $(this.divDtGrados.nativeElement.querySelector('table'));
    this.contruirDataTableGrados(this.tableWidgetGrados );
  }
  guardarProgramaYRedireccionarAProgramas(){
      console.log("ProgramaComponent.guardarProgramaYRedireccionarAProgramas");
      Swal({
        title: "Se guardaran los cambios en el Programa. ¿Desea Continuar?",
        text: "¡No podras revertir la acción!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
        cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
      }).then((result) => {
        if (result) {
          this.guardar(enumRedireccionarA.programas);
        }
      }).catch(error => { console.error("Swal:"+error)});
  }

  private redireccionar(redireccion:enumRedireccionarA, gradoId?){
    console.log("ProgramaComponent.redireccionar");
    if(redireccion == enumRedireccionarA.programas)
      if(this.accion == enumAccion.nuevo){
        this._ngZone.run(() => {
          this.router.navigate(['/programas']);
        });
      }
    if(redireccion == enumRedireccionarA.grado){
      if(gradoId)
      this._ngZone.run(() => {
        this.router.navigate(['/grado/actualizar',this.programa.programaId,gradoId]);
      });
      else
      this._ngZone.run(() => {
        this.router.navigate(['/grado/nuevo',this.programa.programaId]);
      });
    }
  }
  
  guardar(redireccion:enumRedireccionarA, gradoId?){
    console.log("ProgramaComponent.guardar");
    console.log(this.programa);
  
    if(this.accion == enumAccion.actualizar)
       this.actualizarPrograma(this.programa, redireccion,gradoId);
    if(this.accion == enumAccion.nuevo){
       this.insertarPrograma(this.programa, redireccion);
    }
  }

  private obtenerDatosPrograma(programaId){
    console.log("ProgramaComponent.obtenerDatosPrograma");
    console.log("programaId:"+programaId);
    this.programaService.buscar(programaId)
      .subscribe((res) => {
        console.log("**********************");
        this.programa = res.json();
        console.log(this.programa);
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

  private actualizarPrograma(grado,redireccion:enumRedireccionarA, gradoId?){
    console.log("ProgramaComponent.actualizarPrograma");
    this.programaService.actualizar(grado)
    .subscribe((res) => {
        console.log(res);
        Swal({
          type: 'success',
          title: 'Se actualizó correctamente',
          text: "Grado actualizado",
          showConfirmButton: false,
          timer: 1500
        }).catch(error => { console.error("Swal:"+error)});
        this.redireccionar(redireccion,gradoId);
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

  private insertarPrograma(grado, redireccion:enumRedireccionarA){
    console.log("ProgramaComponent.insertarPrograma");
    this.programaService.insertar(grado)
      .subscribe((res) => {
          console.log(res);
          this.programa = res.json();
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

  agregarGrado(){
    Swal({
        title: "Se guardaran los cambios del Programa. ¿Desea Continuar?",
        text: "¡No podras revertir la acción!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
        cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
        if (result) {
            this.guardar(enumRedireccionarA.grado);
        }
    }).catch(error => { console.error("Swal:"+error)});
  }

  contruirDataTableGrados(dtGrados: ElementRef) {
    console.log("ProgramaComponent.contruirDataTableGrados");
    let optGrados: any = {
      ajax: (dataTablesParameters: any, callback) => {
        this.programaService.listarGrados(this.programa.programaId).subscribe((data) => {
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
        title: 'Actividades',
        width: "10%",
        render: function (data, type, grado, meta) {
          var rsp = (grado.conActividades ? 'Si' : 'No')
          return rsp;
        }
      }, {
        render: function (data, type, grado, meta) {
          var btn = '<button type="button" class="btn btn-primary btn-sm" '
          btn += 'onclick="functions.editar(' + grado.gradoId + ')">'
          btn += '<i class="fa fa-edit">&nbsp;</i>Editar'
          btn += '</button>';
          return btn;
        },
        width: "5%"
      }, {
        render: function (data, type, grado, meta) {
          var btn = '<button type="button" class="btn btn-danger btn-sm"'
          btn += 'onclick="functions.eliminar(' + grado.gradoId + ')">'
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
    window.functions.editar = this.editarGrado.bind(this);
    window.functions.eliminar = this.eliminarGrado.bind(this);

    this.tableWidgetGrados = $(dtGrados).DataTable(optGrados);
  }

  editarGrado(gradoId) {
    console.log("ProgramaComponent.editarGrado");
    this._ngZone.run(() => {
      this.router.navigate(['/grado','actualizar',this.programa.programaId,gradoId]);
    });
  }
  eliminarGrado(gradoId) {
    console.log("ProgramaComponent.eliminarGrado");
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
          this.gradoService.eliminar(gradoId).subscribe((res) => {
          this.contruirDataTableGrados(this.tableWidgetGrados );
          Swal({
            position: 'right-end',
            type: 'success',
            title: 'Se Elimino con exito',
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { console.error(error)});
        }), err => {console.error(err)
        };
      }
    }).catch(error => { });
  }
}