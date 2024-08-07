from collections import defaultdict
from typing import List, Tuple

from ..models.asignatura import Asignatura
from ..models.evaluacion_docente import Evaluacion
from ..utils.evaluacion_docente_utils import calcular_promedios


# Servicios para evaluación docente
# Utilizado por Feature 7
# Creado por Xavier Carpio


class evaluacion_docente_service:
    """
        evaluacion_docente_service
        Clase que contiene todos los métodos necesarios para recoger
        información acerca de evaluaciones, sus asignaturas y docentes
    """

    @staticmethod
    def get_evaluaciones_docente(docente_id: int):
        """ Obtiene las evaluaciones de un docente
        Parameters:
            docente_id: int
        Return:
            List<Evaluacion>
        """
        if docente_id is not None:
            return Evaluacion.objects.filter(docente=docente_id).select_related('asignatura')
        return Evaluacion.objects.none()


    @staticmethod
    def get_evaluaciones_asignatura(self):
        """ Obtiene las evaluaciones de una asignatura
             Parameters:
                 asignatura_id: int
             Return:
                 List<Evaluacion>
         """
        if self.id_asignatura is not None:
            return Evaluacion.objects.filter(asignatura=self.id_asignatura)
        return Evaluacion.objects.none()

    @staticmethod
    def get_evaluaciones_tipo(self):
        """ Obtiene las evaluaciones de un tipo específico
             Return:
                 List<Evaluacion>
         """
        if self.id_tipo_evaluacion is not None:
            return Evaluacion.objects.filter(tipo_evaluacion=self.id_tipo_evaluacion)
        return Evaluacion.objects.none()

    @staticmethod
    def get_mejores_docentes_por_asignatura(tipo_evaluacion: int, asignatura: Asignatura) -> List[Tuple[str, float]]:
        """ Obtiene las mejores evaluaciones de por asignatura
            Parameters:
                 tipo_evaluacion: int,
                 asignatura: Asignatura
             Return:
                 List<Evaluacion>
        """
        evaluaciones = Evaluacion.objects.filter(tipo_evaluacion=tipo_evaluacion, asignatura=asignatura)

        return calcular_promedios(evaluaciones)

    @staticmethod
    def get_mejores_evaluaciones() -> List[Tuple[str, float]]:
        """ Obtiene las evaluaciones en general
             Return:
                 List<Evaluacion>
             """
        evaluaciones = Evaluacion.objects.all()
        return calcular_promedios(evaluaciones)
