
from django.conf.urls import url
from django.urls import path

from .views import *
from .ansible_views import *

urlpatterns = [
    url(r'template/$', TemplateView.as_view()),
    url(r'ansible/$', ShowAnsibleview.as_view()),
    path('ansible/<int:task_id>/', HistoryView.as_view()),
    url(r'ansible/do_job/$', DoAnsibleview.as_view()),
    url(r'template/import/$', upload_file),
    url(r'template/submit/$', upload_submit),
    url(r'do/$', do_task),
]
