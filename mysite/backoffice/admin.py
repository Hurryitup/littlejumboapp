from django.contrib import admin

from .models import VisitingDay, StandaloneEvent, CompositeEvent, SubEvent, Coupon
import nested_admin
# Register your models here.

class StandaloneEventInline(nested_admin.NestedStackedInline):
    model = StandaloneEvent
    extra = 1

class SubEventInline(nested_admin.NestedStackedInline):
    model = SubEvent
    extra = 1

class CompositeEventAdmin(nested_admin.NestedModelAdmin):
    inlines = [SubEventInline]

class CompositeEventInline(nested_admin.NestedStackedInline):
    model = CompositeEvent
    inlines = [SubEventInline]
    extra = 1


class VisitingDayAdmin(nested_admin.NestedModelAdmin):
    inlines = [StandaloneEventInline, CompositeEventInline]

admin.site.register(VisitingDay, VisitingDayAdmin)
admin.site.register(StandaloneEvent)
admin.site.register(CompositeEvent, CompositeEventAdmin)
admin.site.register(Coupon)
