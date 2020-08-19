
from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^$', SettingView.as_view()),
    url(r'^ldap_test/$', ldap_test),
    url(r'^email_test/$', email_test),
    url(r'^about/$', get_about)
]
