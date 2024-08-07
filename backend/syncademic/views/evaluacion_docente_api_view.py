from rest_framework import viewsets, status
from rest_framework.decorators import action

from ..models.asignatura import Asignatura
from ..models.evaluacion_docente import Evaluacion
from ..serializers.evaluacion_docente_serializer import EvaluacionSerializer
from ..serializers.docente_serializer import DocenteSerializer
from rest_framework.response import Response
# from ..services.evaluacion_docente_service import docentes_por_promedio, sugerencias_docentes
from ..services.evaluacion_docente_service import evaluacion_docente_service


class EvaluacionViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer

    @action(detail=False, methods=['get'],
            url_path='docentes-por-promedio/(?P<tipo_evaluacion>[^/.]+)/(?P<asignatura_id>[^/.]+)')
    def docentes_por_promedio(self, request, tipo_evaluacion, asignatura_id):
        tipo_evaluacion_int = int(tipo_evaluacion)  # Convertir a entero
        asignatura = Asignatura.objects.get(id_asignatura=asignatura_id)
        servicio = evaluacion_docente_service()
        resultados = servicio.get_mejores_docentes_por_asignatura(tipo_evaluacion_int, asignatura)
        data = [{'docente': DocenteSerializer(docente).data, 'promedio': promedio} for docente, promedio in resultados]
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='sugerencias-docentes')
    def sugerencias_docentes(self, request):
        servicio = evaluacion_docente_service()
        resultados = servicio.get_mejores_evaluaciones()
        data = [{'docente': DocenteSerializer(docente).data, 'promedio': promedio} for docente, promedio in resultados]
        return Response(data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'], url_path='evaluaciones-docente/(?P<docente_id>[^/.]+)')
    def evaluaciones_docente(self, request, docente_id):
        servicio = evaluacion_docente_service()
        evaluaciones = servicio.get_evaluaciones_docente(int(docente_id))
        data = [
            {
                'evaluacion': EvaluacionSerializer(evaluacion).data,
            }
            for evaluacion in evaluaciones
        ]
        return Response(data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'], url_path='detalle-asignatura/(?P<asignatura_id>[^/.]+)')
    def detalle_asignatura(self, request, asignatura_id):
        evaluaciones = Evaluacion.objects.filter(asignatura_id=asignatura_id)
        docentes = evaluaciones.values('docente').distinct()
        if len(docentes) >= 2:
            tipo_evaluacion = request.query_params.get('tipo_evaluacion', 1)  # Default to 1 if not provided
            return self.docentes_por_promedio(request, tipo_evaluacion, asignatura_id)
        else:
            return self.sugerencias_docentes(request)