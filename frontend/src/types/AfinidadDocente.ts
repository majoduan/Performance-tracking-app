export type Docente = {
    id_docente: number,
    nombre: string;
    correo: string;
    promedio: number;
    atributos?: Array<string>;
    numPeriodosAcademicos: number;
    notas: Array<number>;
}

export type Asignatura = {
    id_asignatura: number,
    nombre: string;
}
