export interface IGrado{ 
    gradoId?:number;
    nombre: string;
    descripcion: string;
    conActividades:boolean;
    estado:number;
    programaId?:number;
};