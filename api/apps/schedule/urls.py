
from .views import *
from apps.exec.ansible_views import Ansibleview
from django.urls import path


urlpatterns = [
    path('', Ansibleview.as_view()),
    path('<int:t_id>/', HistoryView.as_view()),
    path('run_time/', next_run_time),
]
