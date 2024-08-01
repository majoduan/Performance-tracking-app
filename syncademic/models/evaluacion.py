from collections import defaultdict

from django.db import models

from syncademic.models import Docente
from syncademic.models.asignatura import Asignatura
from syncademic.models.tipoEvaluacion import TipoEvaluacion


class Evaluacion(models.Model):
    tipo_evaluacion = models.IntegerField(choices=TipoEvaluacion.choices)
    calificacion = models.FloatField()
    asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)
    docente = models.ForeignKey(Docente, on_delete=models.CASCADE)

    @classmethod
    def docentes_por_promedio(cls, tipo_evaluacion: int, asignatura: Asignatura):
        resultados = defaultdict(list)
        evaluaciones = cls.objects.filter(tipo_evaluacion=tipo_evaluacion, asignatura=asignatura)
        for evaluacion in evaluaciones:
            resultados[evaluacion.docente].append(evaluacion.calificacion)

        promedios_docentes = []
        for docente, calificaciones in resultados.items():
            promedio = sum(calificaciones) / len(calificaciones)
            promedios_docentes.append((docente, promedio))

        promedios_docentes.sort(key=lambda x: x[1], reverse=True)
        return promedios_docentes

    @classmethod
    def validar_docentes_asignatura(cls, nombre_asignatura: str):
        asignatura_docentes = cls.objects.filter(asignatura__nombre=nombre_asignatura).count()
        return asignatura_docentes >= 2

    @classmethod
    def sugerencias_docentes(cls):
        resultados = defaultdict(list)
        evaluaciones = cls.objects.all()
        for evaluacion in evaluaciones:
            resultados[evaluacion.docente].append(evaluacion.calificacion)

        promedios_docentes = []
        for docente, calificaciones in resultados.items():
            promedio = sum(calificaciones) / len(calificaciones)
            promedios_docentes.append((docente, promedio))

        promedios_docentes.sort(key=lambda x: x[1], reverse=True)
        return promedios_docentes