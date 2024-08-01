from rest_framework import serializers
from syncademic.models import asignatura, docente, evaluacion
from syncademic.models.asignatura import Asignatura
from syncademic.models.evaluacion import Evaluacion
from syncademic.models.docente import Docente

class AsignaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignatura
        fields = '__all__'

class DocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Docente
        fields = '__all__'

class EvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluacion
        fields = '__all__'
