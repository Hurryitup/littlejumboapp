from rest_framework import viewsets
from itertools import chain

from backoffice.models import VisitingDay, Coupon, Event, StandaloneEvent, \
                              CompositeEvent, SubEvent
from .serializers import VisitingDaySerializer, CouponSerializer, \
                         StandaloneEventSerializer, CompositeEventSerializer, \
                         SubEventSerializer

class VisitingDayViewSet(viewsets.ModelViewSet):
    queryset = VisitingDay.objects.all()
    serializer_class = VisitingDaySerializer

class StandaloneEventViewSet(viewsets.ModelViewSet):
    serializer_class = StandaloneEventSerializer

    def get_queryset(self):
        queryset = StandaloneEvent.objects.all()
        visiting_day = self.request.query_params.get('visiting_day', None)
        if visiting_day is not None:
            queryset = queryset.filter(visiting_day__pk=visiting_day)
        return queryset

class CompositeEventViewSet(viewsets.ModelViewSet):
    serializer_class = CompositeEventSerializer

    def get_queryset(self):
        queryset = CompositeEvent.objects.all()
        visiting_day = self.request.query_params.get('visiting_day', None)
        if visiting_day is not None:
            queryset = queryset.filter(visiting_day__pk=visiting_day)
        return queryset

class SubEventViewSet(viewsets.ModelViewSet):
    serializer_class = SubEventSerializer

    def get_queryset(self):
        queryset = SubEvent.objects.all()
        composite_event = self.request.query_params.get('composite_event', None)
        if composite_event is not None:
            queryset = queryset.filter(composite_event__pk=composite_event)
        return queryset

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
