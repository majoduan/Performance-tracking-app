from ..models.notas import HistorialNotas
from ..models.asignatura import Asignatura
from ..models.periodo import Periodo
from ..models.estudiante import Estudiante
from django.db.models import OuterRef, Avg, Subquery


class SeguimientoService:
    """
        Servicio de seguimiento de malla

        Clase destinada a manejar la mayoría de la lógica de negocio.
        Tiene contacto directo con los modelos - base de datos.

        Attributes:
            asignatura_prerequisito: String
            periodo_actual: String

        Utilizado para Feature 4.
        Creado por Bryan Rosillo.
    """

    def __init__(self, asignatura_prerequisito: str, periodo_actual: str):
        self.asignatura_prerequisito = asignatura_prerequisito
        self.periodo_actual = periodo_actual

    def obtener_estudiantes_candidatos(self):
        """
            Tiene como fin determinar los estudiantes que necesitan ir al curso de verano.
            Esto en base a sus promedios finales de una asignatura prerequisito en un periódo
            específico, y a un rango establecido por la nota mínima de las asignaturas y
            un promedio histórico de las materias relacionadas.

            Return:
                estudiantes_candidatos: QuerySet[Estudiante]
        """

        try:

            # Se busca la asignatura y periodo actual.
            asignatura_prerequisito = Asignatura.objects.get(nombre=self.asignatura_prerequisito)
            periodo_actual = Periodo.objects.get(nombre=self.periodo_actual)

            # Determinamos a los estudiantes candidatos al curso de verano en base a la nota mínima y promedio histórico.
            # Hay que notar, que la comparación se hace en la línea con:
            # promedio__gte -> "Mayor o igual que..."
            # promedio__lte -> "Menor o igual que..."

            id_estudiantes_candidatos = (
                HistorialNotas.objects
                .filter(id_asignatura=asignatura_prerequisito.id_asignatura)
                .filter(periodo=periodo_actual.id_periodo)
                .values('id_estudiante')
                .annotate(
                    promedio=Subquery(self.obtener_promedio_notas_estudiantes(asignatura_prerequisito, periodo_actual)))
                .filter(promedio__gte=asignatura_prerequisito.nota_minima)
                .filter(promedio__lte=self.obtener_promedio_historico())
            ).values_list('id_estudiante', flat=True)

            # Con los identificadores solo hace falta hacer una consulta en tabla de estudiantes.

            estudiantes_candidatos = Estudiante.objects.filter(
                id_estudiante__in=id_estudiantes_candidatos
            ).annotate(promedio_notas=Subquery(
                self.obtener_promedio_notas_estudiantes(asignatura_prerequisito, periodo_actual)))

            return estudiantes_candidatos

        except Periodo.DoesNotExist:
            raise ValueError("Periodo actual no encontrado.")
        except Exception as e:
            raise ValueError(
                "No es posible identificar a los estudiantes con problemas, puesto que, la asignatura indicada "
                "no tiene una asignatura subsecuente.")

    def obtener_promedio_historico(self):
        """
            Sirve para obtener el promedio histórico a partir de una asignatura prerequisito, y un
            periódo.

            Return:
                promedio_historico: float
        """

        try:
            # Para obtener el promedio histórico, hay que determinar las asignaturas y periodos.
            asignatura_prerequisito = Asignatura.objects.get(nombre=self.asignatura_prerequisito)
            asignatura_subsecuente = Asignatura.objects.get(id_asignatura=asignatura_prerequisito.subsecuente_id)
            periodo_actual = Periodo.objects.get(nombre=self.periodo_actual)
            periodo_anterior = Periodo.objects.get(id_periodo=periodo_actual.id_periodo - 1)

            # Obtenemos a los estudiantes que tienen menos de la nota mínima en la asignatura subsecuente actual.
            estudiantes_asignatura_subsecuente_periodo_actual = (
                HistorialNotas.objects
                .filter(id_asignatura=asignatura_subsecuente.id_asignatura)
                .filter(periodo=periodo_actual.id_periodo)
                .values('id_estudiante')
                .annotate(promedio_notas=Subquery(
                    self.obtener_promedio_notas_estudiantes(asignatura_subsecuente, periodo_actual)))
                .filter(promedio_notas__lt=asignatura_subsecuente.nota_minima)
            ).values_list('id_estudiante', flat=True)

            if estudiantes_asignatura_subsecuente_periodo_actual.exists():

                # Obtenemos las notas de los mismos estudiantes pero en la materia prerequisito y periodo anterior.
                notas_prerequisito = (
                    HistorialNotas.objects
                    .filter(id_estudiante__in=estudiantes_asignatura_subsecuente_periodo_actual,
                            id_asignatura=asignatura_prerequisito.id_asignatura,
                            periodo=periodo_anterior.id_periodo)
                    .values('id_estudiante')
                    .annotate(promedio_notas=Subquery(
                        self.obtener_promedio_notas_estudiantes(asignatura_prerequisito, periodo_anterior)))
                    .values_list('promedio_notas', flat=True)
                )

                # Sacamos el promedio histórico.
                if notas_prerequisito:
                    promedio_historico = sum(notas_prerequisito) / len(notas_prerequisito)
                else:
                    promedio_historico = 0
            else:
                promedio_historico = 0

            return promedio_historico

        except Asignatura.DoesNotExist:
            raise ValueError("Hay un problema al localizar las asignaturas.")
        except Periodo.DoesNotExist:
            raise ValueError("Periodo actual no encontrado.")
        except Exception as e:
            raise ValueError(f"Se produjo un error al calcular el promedio histórico -> {str(e)}")

    def obtener_promedio_notas_estudiantes(self, asignatura, periodo):
        """
            Este método es útil para obtener el promedio de todas las notas del estudiante.
            Es un subquery, por lo tanto, debe ser empleado en una consulta.

            Return:
                promedio_notas_estudiantes: QuerySet
        """

        promedio_notas_estudiantes = (
            HistorialNotas.objects
            .filter(id_asignatura=asignatura.id_asignatura,
                    periodo=periodo.id_periodo,
                    id_estudiante=OuterRef('id_estudiante'))
            .annotate(promedio=Avg('nota'))
            .values('promedio')
        )

        return promedio_notas_estudiantes
