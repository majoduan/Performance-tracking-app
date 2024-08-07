from rest_framework import serializers

from ..models.evaluacion_docente import Evaluacion


# Serializador de Evaluación
# Utilizado por Feature 7
# Creado por Xavier Carpio

class EvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluacion
        fields = '__all__'
