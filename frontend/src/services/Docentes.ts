import { Docente } from "../types/AfinidadDocente";

export const obtenerDocentes = async (
  asignatura: number,
  tipoEvaluacion: number
): Promise<Docente[]> => {
  const url = `https://syncademic-0-1.onrender.com/syncademic/evaluacion-docente/docentes-por-promedio/${tipoEvaluacion}/${asignatura}/`;

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
        promedio: item.promedio,
      }));
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
};