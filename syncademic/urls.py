from django.urls import path, include
from rest_framework.routers import DefaultRouter
from syncademic.views.seguimiento_docente_view import AsignaturaViewSet,DocenteViewSet,EvaluacionViewSet

router = DefaultRouter()
router.register(r'asignatura', AsignaturaViewSet)
router.register(r'docente', DocenteViewSet)
router.register(r'evaluacion', EvaluacionViewSet)

urlpatterns = [
    path("seguimiento_docente", include(router.urls)),
]
