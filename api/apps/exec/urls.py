
from django.conf.urls import url

from .views import *
from .ansible_views import *

urlpatterns = [
    url(r'template/$', TemplateView.as_view()),
    url('ansible/$', Ansibleview.as_view()),
    url(r'template/import/$', upload_file),
    url(r'template/submit/$', upload_submit),
    url(r'do/$', do_task),
]
