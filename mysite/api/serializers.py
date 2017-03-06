from rest_framework import serializers
from backoffice.models import VisitingDay, Coupon, StandaloneEvent, \
                              CompositeEvent, SubEvent

class StandaloneEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = StandaloneEvent
        fields = ('pk', 'name', 'description', 'start', 'end', 'coordinator',
                  'audience', 'balloon_color', 'address', 'location',
                  'visiting_day')

class SubEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SubEvent
        fields = ('pk', 'name', 'description', 'start', 'end', 'coordinator',
                  'audience', 'balloon_color', 'address', 'location',
                  # )
                  'composite_event')

class SubEventNestedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SubEvent
        fields = ('pk', 'name', 'description', 'start', 'end', 'coordinator',
                  'audience', 'balloon_color', 'address', 'location')

class CompositeEventSerializer(serializers.HyperlinkedModelSerializer):
    sub_events = SubEventNestedSerializer(many=True, read_only=True)

    class Meta:
        model = CompositeEvent
        fields = ('pk', 'name', 'description', 'start', 'end',
                  'visiting_day', 'sub_events')

class VisitingDaySerializer(serializers.HyperlinkedModelSerializer):
    standalone_events = StandaloneEventSerializer(many=True, read_only=True)
    composite_events = CompositeEventSerializer(many=True, read_only=True)

    class Meta:
        model = VisitingDay
        fields = ('pk', 'name', 'date', 'standalone_events',
                  'composite_events')


class CouponSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Coupon
        fields = ('pk', 'name', 'description', 'image')