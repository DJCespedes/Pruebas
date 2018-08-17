import { Component, OnInit, ElementRef, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ConvocatoriasService } from "../../services/convocatorias.service";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-administracion-convocatorias',
    templateUrl: './convocatorias.component.html'
})

export class ConvocatoriasComponent implements OnInit {

    shipmentsTable: any;
    tableWidget: any;

    @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void { }

    constructor(private convocatoriasService: ConvocatoriasService,
        private el: ElementRef,
        private router: Router,
        private _ngZone: NgZone) {
    }

    ngOnInit(): void {
        this.contruirDataTable();
    }

    contruirDataTable() {
        if (this.tableWidget) {
            this.tableWidget.ajax.reload();
        }
        else {
            let optProgramas: any = {
                ajax: (dataTablesParameters: any, callback) => {
                    this.convocatoriasService.listar().subscribe((data) => {
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
                    },
                    width: "10%"
                }, {
                    title: 'Descripcion',
                    data: 'descripcion',
                    width: "60%"
                }, {
                    title: 'Fecha Inicio',
                    data: 'fechaInicio',
                    width: "20%"
                }, {
                    title: 'FechaFin',
                    data: 'fechaFin',
                    width: "20%"
                }, {
                    title: 'Cupos',
                    data: 'cupos',
                    width: "10%"
                }],
                select: false,
                bSort: false,
                pageLength: 5,
                language: { url: "./../assets/Spanish.js" },
                dom: 'Bfrtip',
                buttons: []
            };

            window.functions = window.functions || {};

            this.shipmentsTable = $(this.el.nativeElement.querySelector('table'));
            this.tableWidget = this.shipmentsTable.DataTable(optProgramas);



        }
    }

    nuevo() {
        this._ngZone.run(() => {
            this.router.navigate(['/convocatoria/nuevo/1']);
        });
    }

}