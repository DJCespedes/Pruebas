import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgramasService } from "../../services/programas.service";
import { ConvocatoriasService } from "../../services/convocatorias.service"
import Swal from 'sweetalert2';
import { IConvocatoria } from "../../interfaces/convocatoria.interface"
import { GradoService } from '../../services/grado.service';

@Component({
    selector: 'app-convocatoria',
    templateUrl: './convocatoria.component.html'
})

export class ConvocatoriaComponent implements OnInit {
    convocatoria: IConvocatoria = { convocatoriaId: 0, fechaFin: new Date(), fechaInicio: new Date(), cupos: 0, descripcion: '' };

    programas = null;
    current: number = -1;
    current2: number = -1;
    current3: number = -1;
    today: Date;
    fechas = [];
    tableWidget: any;
    shipmentsTable: any;
    @ViewChild('divDtFechas') divDtFechas: ElementRef;
    dtFechas;
    accion: string;

    ngOnInit(): void {

    }



    constructor(private programasService: ProgramasService,
        private gradoService: GradoService,
        private convocatoriasService: ConvocatoriasService,
        private el: ElementRef,
        private router: Router,
        private route: ActivatedRoute) {
        this.route.params
            .subscribe(parametros => {
                this.accion = parametros['accion']
                console.log(this.accion);
            })
        this.programasService.listar().subscribe((data) => {
            this.programas = data.json()


            for (let programa of this.programas) {
                programa.activo=true;
                programa.turno='M';
                programa.cupos=0;
                this.programasService.listarGrados(programa.programaId).subscribe((data) => {
                    programa.grados = data.json();
                    for (let grado of programa.grados) {
                        grado.activo=true;
                        grado.turno='M';
                        grado.cupos=0;
                        this.gradoService.listarActividades(grado.gradoId).subscribe((data) => {
                            grado.actividades = data.json();
                            for (let actividad of grado.actividades) {
                                actividad.activo=true;
                                actividad.turno='M';
                                actividad.cupos=0;
                            }
                        }, err => {
                            Swal({
                                type: 'error',
                                title: 'Ocurrio un error, por favor intente despues',
                                showConfirmButton: false,
                                timer: 1500
                            }).catch(err => { console.log("Swal:" + err) });
                        });
                    }
                }, err => {
                    Swal({
                        type: 'error',
                        title: 'Ocurrio un error, por favor intente despues',
                        showConfirmButton: false,
                        timer: 1500
                    }).catch(err => { console.log("Swal:" + err) });
                });
            }
        }), err => {
            Swal({
                position: 'right-end',
                type: 'error',
                title: err,
                showConfirmButton: false,
                timer: 1500
            }).catch(error => { });
        };
    }

    generarFechas() {
        this.convocatoriasService.generarFechas(this.convocatoria.fechaInicio, this.convocatoria.fechaFin).subscribe((data) => {
            this.fechas = data.json();
        }, err => {
            Swal({
                type: 'error',
                title: 'Ocurrio un error, por favor intente despues',
                showConfirmButton: false,
                timer: 1500
            }).catch(err => { console.log("Swal:" + err) });
        });

    }

    contruirDataTable(dataTable) {
        if ($.fn.dataTable.isDataTable(dataTable)) {
            //this.tableWidget.ajax.reload();
        }
        else {
            let optFechas: any = {
                columns: [
                    {
                        defaultContent: '',
                        className: "select-checkbox"
                    }, {
                        title: "#",
                        render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    }, {
                        title: 'Fecha',
                        data: 'fecha',
                        width: "35%",
                        render: function (data, type, row, meta) {
                            var date = new Date(row.fecha);
                            var dd = date.getDate();
                            var mm = date.getMonth() + 1;
                            var yyyy = date.getFullYear();
                            var returnDate = '';
                            if (dd < 10) { returnDate += '0' + dd + '/'; } else { returnDate += dd + '/'; }
                            if (mm < 10) { returnDate += '0' + mm + '/'; } else { returnDate += mm + '/'; }
                            returnDate += yyyy;
                            return returnDate;
                        }
                    }],
                select: {
                    style: "multi",
                    selector: "td:first-child"
                },
                paging: false, bFilter: false, bSearchable: false, bInfo: false, bSort: false,
                dom: 'Bfrtip',
                buttons: []
            };
            //this.shipmentsTable = $(this.divDtFechas.nativeElement.querySelector('table'));
            this.tableWidget = $(dataTable).DataTable(optFechas);
            this.tableWidget.rows.add(this.fechas).draw();
        }
    }

    verPrograma(dataTable, programa) {
        if (programa.grados.length == 0) {
            this.contruirDataTable(dataTable);
            programa.dataTable = dataTable;
            programa.dtFechas = this.tableWidget;
        } else {
            this.current2 = -1;
        }
    }

    verGrado(dataTable, grado) {
        if (grado.actividades.length == 0) {
            this.contruirDataTable(dataTable);
            grado.dataTable = dataTable;
            grado.dtFechas = this.tableWidget;
        } else {
            this.current3 = -1;
        }
    }

    verActividad(dataTable, actividad) {
        this.contruirDataTable(dataTable);
        actividad.dataTable = dataTable;
        actividad.dtFechas = this.tableWidget;
    }

    guardar() {
        var convocatoriaOfertadas = [];
        var convocatoriaOfertada = {
            convocatoriaOfertadaModelId: 0,
            convocatoriaId: 0, GradoId: 0,
            programaId: 0,
            actividadId: 0,
            fecha: new Date(),
            cupos: 0,
            turno: 'T'
        }
        for (let programa of this.programas) {
            if (programa.grados.length == 0) {
                if ($.fn.dataTable.isDataTable(programa.dtFechas)) {
                    var seleccionados = programa.dtFechas.rows({ selected: true }).data();
                    for (let seleccionado of seleccionados) {
                        convocatoriaOfertada = {
                            convocatoriaOfertadaModelId: 0,
                            convocatoriaId: 0, GradoId: 0,
                            programaId: programa.programaId,
                            actividadId: 0,
                            fecha: seleccionado.fecha,
                            cupos: programa.cupos,
                            turno: programa.turno
                        }
                        convocatoriaOfertadas.push(convocatoriaOfertada);
                    }
                }
            } else {
                for (let grado of programa.grados) {
                    if (grado.actividades.length == 0) {
                        if ($.fn.dataTable.isDataTable(grado.dtFechas)) {
                            var seleccionados = grado.dtFechas.rows({ selected: true }).data();
                            for (let seleccionado of seleccionados) {
                                convocatoriaOfertada = {
                                    convocatoriaOfertadaModelId: 0,
                                    convocatoriaId: 0, GradoId: grado.gradoId,
                                    programaId: programa.programaId,
                                    actividadId: 0,
                                    fecha: seleccionado.fecha,
                                    cupos: grado.cupos,
                                    turno: grado.turno
                                }
                                convocatoriaOfertadas.push(convocatoriaOfertada);
                            }
                        }
                    } else {
                        for (let actividad of grado.actividades) {
                            if (actividad.dtFechas !== undefined) {
                                var seleccionados = actividad.dtFechas.rows({ selected: true }).data();
                                for (let seleccionado of seleccionados) {
                                    convocatoriaOfertada = {
                                        convocatoriaOfertadaModelId: 0,
                                        convocatoriaId: 0, GradoId: grado.gradoId,
                                        programaId: programa.programaId,
                                        actividadId: actividad.actividadId,
                                        fecha: seleccionado.fecha,
                                        cupos: actividad.cupos,
                                        turno: actividad.turno
                                    }
                                    convocatoriaOfertadas.push(convocatoriaOfertada);
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log(convocatoriaOfertadas);
    }

}