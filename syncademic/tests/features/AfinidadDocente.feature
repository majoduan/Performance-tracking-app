# Created by xavic at 22/7/2024
#language: es

Característica: Identificación afinidad de un docente para dictar una asignatura
  Como institución
  quiero identificar aquellos docentes con mayor promedio en las evaluaciones
  integrales de una asignatura particular durante toda su carrera profesional en la institución
  para decidir cuáles tienen mayor afinidad en la asignatura

  #por asignatura
  Esquema del escenario: Identificación de docentes con mayor calificación promedio en evaluación integral por materia
    Dado que existen al menos dos docentes que han impartido la asignatura "<nombre_asignatura>"
    Cuando se solicita identificar el docente con mayor calificación promedio en "<tipo_evaluacion>"
    Entonces se presenta el listado de docentes en orden de mayor a menor con respecto a su calificación
    Ejemplos:
      | nombre_asignatura | tipo_evaluacion |
      | Comunicación      | Heteroevaluacion|
      | Física            | Autoevaluacion  |
      | Química           | Coevaluacion    |
      | Geometría         | Total           |

  #por profesor
  Esquema del escenario: Identificación de asignaturas con mayor calificación promedio en evaluación integral por docente
    Dado que existe el docente que han impartido las asignaturas "<nombre_asignatura>"
    Cuando se solicita identificar el docente con mayor calificación promedio en "<tipo_evaluacion>"
    Entonces se presenta el listado de docentes en orden de mayor a menor con respecto a su calificación
    Ejemplos:
      | nombre_asignatura | tipo_evaluacion |
      | Comunicación      | Heteroevaluacion|
      | Física            | Autoevaluacion  |
      | Química           | Coevaluacion    |
      | Geometría         | Total           |

  #planificacion nuevo semestre
  Esquema del escenario: Planificación para asignar docentes destacados a clases con bajo rendimiento
    Dado que se ha identificado la asignatura "<nombre_asignatura>" con bajo rendimiento estudiantil,
    Y se han seleccionado docentes con alta calificación promedio en "<tipo_evaluacion>",
    Cuando se realiza el proceso de planificación de la carga académica,
    Entonces se sugiere docentes con alta afinidad a la asignatura.
    Ejemplos:
      | nombre_asignatura | tipo_evaluacion  |
      | Comunicación      | Heteroevaluacion |
      | Física            | Autoevaluacion   |
      | Química           | Coevaluacion     |
      | Geometría         | Total            |