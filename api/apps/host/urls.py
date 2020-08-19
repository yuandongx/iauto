
from django.urls import path

from .views import *

urlpatterns = [
    path('', HostView.as_view()),
    path('import/', post_import),
]
