export type Docente = {
    id_docente: number,
    nombre: string;
    correo: string;
    promedio: number;

    tipo_evaluacion: number;
    calificacion: number;
    periodo: string;

}

export type Asignatura = {
    id_asignatura: number,
    nombre: string;
}
