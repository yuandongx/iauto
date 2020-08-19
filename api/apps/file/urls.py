
from django.urls import path

from .views import *

urlpatterns = [
    path('', FileView.as_view()),
    path('object/', ObjectView.as_view()),
]
