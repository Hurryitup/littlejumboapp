from django.conf.urls import include, url
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'standalone_events', views.StandaloneEventViewSet, 'StandaloneEvent')
router.register(r'composite_events', views.CompositeEventViewSet, 'CompositeEvent')
router.register(r'sub_events', views.SubEventViewSet, 'SubEvent')
router.register(r'visiting_days', views.VisitingDayViewSet)
router.register(r'coupons', views.CouponViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]