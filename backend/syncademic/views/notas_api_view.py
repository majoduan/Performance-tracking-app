from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework import permissions

from ..models.notas import HistorialNotas
from ..serializers import ListaEstudianteSerializer
from ..services import NotasService
from ..exceptions.not_found import ObjectNotFound


class ControlNotasAPIView(viewsets.ModelViewSet):
    """ API Endpoint para ControlNotas.
        Utilizado para Feature 2
        Creado por Alejandra Colcha
    """
    queryset = HistorialNotas.objects.all()
    serializer_class = ListaEstudianteSerializer
    permission_classes = (permissions.AllowAny,)
    service = NotasService()

    @action(detail=False, methods=['get'], url_path='estudiantes/(?P<id_asignatura>[^/.]+)/(?P<periodo>[^/.]+)/(?P<grupo>[^/.]+)/')
    def get_promedios(self, request, id_asignatura, periodo, grupo):
        """ Obtiene la lista de estudiantes con sus promedios de la asignatura, periodo y grupo indicados.
            GET /estudiantes/<int:id_asignatura>/<int:periodo>/<int:grupo>
        """
        self.service.id_asignatura = id_asignatura
        self.service.periodo = periodo
        self.service.grupo = grupo

        try:
            estudiantes = self.service.get_promedios_estudiantes()
            return Response(estudiantes, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response({'Error': e.detail}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='(?P<id_asignatura>[^/.]+)/(?P<periodo>[^/.]+)/(?P<grupo>[^/.]+)/')
    def get(self, request, id_asignatura, periodo, grupo):
        """ Obtiene la lista de estudiantes para el ingreso de notas de la asignatura, periodo y grupo indicados.
            GET /<int:id_asignatura>/<int:periodo>/<int:grupo>
        """
        self.service.id_asignatura = id_asignatura
        self.service.periodo = periodo
        self.service.grupo = grupo

        try:
            estudiantes = self.service.get_lista_estudiantes()
            serializer = ListaEstudianteSerializer(estudiantes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response({'Error': e.detail}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='(?P<id_asignatura>[^/.]+)/(?P<periodo>[^/.]+)/(?P<grupo>[^/.]+)/')
    def post(self, request, id_asignatura, periodo, grupo):
        """ Actualiza la lista de notas para la asignatura, periodo y grupo indicados.
            POST /<int:id_asignatura>/<int:periodo>/<int:grupo>

            Body: lista de objetos con atributos [id_estudiante, nombre, nota, tema, tipo_actividad]

            Response: [en_riesgo, alerta_media, alerta_alta]
        """
        for notas_data in request.data:
            data = {
                'id_estudiante': notas_data['id_estudiante'],
                'nombre': notas_data['nombre'],
                'nota': notas_data['nota'],
                'tema': notas_data['tema'],
                'tipo_actividad': notas_data['tipo_actividad'],
            }

            self.service.id_asignatura = id_asignatura
            self.service.periodo = periodo
            self.service.grupo = grupo
            
            self.service.save_nota(data)

        mensaje = self.service.get_alertas()
        self.service.reset_conteo_alertas()

        return Response(mensaje, status=status.HTTP_201_CREATED)
