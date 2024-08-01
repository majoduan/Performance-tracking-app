from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from syncademic.serializers.seguimiento_docente_serializer import AsignaturaSerializer, DocenteSerializer, EvaluacionSerializer
from syncademic.models.asignatura import Asignatura
from syncademic.models.evaluacion import Evaluacion
from syncademic.models.docente import Docente

class AsignaturaViewSet(viewsets.ModelViewSet):
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer

class DocenteViewSet(viewsets.ModelViewSet):
    queryset = Docente.objects.all()
    serializer_class = DocenteSerializer

class EvaluacionViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer

    @action(detail=False, methods=['get'], url_path='docentes-por-promedio/(?P<tipo_evaluacion>[^/.]+)/(?P<asignatura_id>[^/.]+)')
    def docentes_por_promedio(self, request, tipo_evaluacion, asignatura_id):
        tipo_evaluacion_int = int(tipo_evaluacion)  # Convertir a entero
        asignatura = Asignatura.objects.get(id=asignatura_id)
        resultados = Evaluacion.docentes_por_promedio(tipo_evaluacion_int, asignatura)
        data = [{'docente': DocenteSerializer(docente).data, 'promedio': promedio} for docente, promedio in resultados]
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='sugerencias-docentes')
    def sugerencias_docentes(self, request):
        resultados = Evaluacion.sugerencias_docentes()
        data = [{'docente': DocenteSerializer(docente).data, 'promedio': promedio} for docente, promedio in resultados]
        return Response(data, status=status.HTTP_200_OK)
