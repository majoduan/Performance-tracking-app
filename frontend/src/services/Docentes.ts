import { Docente } from "../types/AfinidadDocente";

export const obtenerDocentes = async (asignatura: number): Promise<Docente[]> => {
  const url = "https://syncademic-0-1.onrender.com/syncademic/evaluacion-docente/detalle-asignatura/"+asignatura+"/";

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data.map((item: any) => ({
        id_docente: item.docente.id_docente,
        nombre: item.docente.nombre,
        correo: item.docente.correo,
        estadoCapacitacion: item.docente.estado_capacitacion,
        carrera: item.docente.carrera,
        puntajeActual: item.docente.puntaje_actual,
        promedio: item.promedio,
        notas: [], // asumiendo que estas notas no vienen en la respuesta actual
        numPeriodosAcademicos: 0 // asumiendo que este valor no viene en la respuesta actual
      }));
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
};