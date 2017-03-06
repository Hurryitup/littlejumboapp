from __future__ import unicode_literals
from colorful.fields import RGBColorField
from django.db import models
from django.utils import timezone
from location_field.models.plain import PlainLocationField
from django.conf.urls.static import static
from django.conf import settings


from django.db import models


class VisitingDay(models.Model):
    name = models.CharField(max_length=25)
    date = models.DateTimeField('date of event')
    def __str__(self):
        return self.name

class Coupon(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    image = models.ImageField(upload_to='coupon_images/')
    def __str__(self):
        return self.name

class Event(models.Model):
    name = models.CharField(max_length=25)
    description = models.CharField(max_length = 255)
    start = models.DateTimeField()
    end = models.DateTimeField()
    class Meta :
        abstract = True
    def __str__(self):
        return self.name

class SingleEvent(Event):
    coordinator = models.CharField(max_length = 31)
    STUDENT = 'S'
    PARENT = 'P'
    AUDIENCE_TYPE = (
        (STUDENT, 'Student'),
        (PARENT, 'Parent'),
    )
    audience = models.CharField(
        max_length=1,
        choices = AUDIENCE_TYPE,
        blank = True,
    )
    RED = 'RED'
    ORANGE = 'ORA'
    YELLOW = 'YEL'
    BLUE = 'BLU'
    GREEN = 'GRE'
    PURPLE = 'PUR'
    BLACK = 'BLA'
    WHITE = 'WHI'
    COLORS = (
        (RED, 'Red'),
        (WHITE, 'White'),
        (YELLOW, 'Yellow'),
    )
    """
    balloon_color = models.CharField(
        max_length = 1,
        blank = True,
        choices = COLORS
        """
    balloon_color = RGBColorField(blank=True, null=True)
    address = models.CharField(max_length=255)
    location = PlainLocationField(based_fields=['address'], zoom=7)
    """
    visiting_day = models.ForeignKey(
        VisitingDay,
        on_delete=models.CASCADE,
    )
    """
    class Meta:
        abstract = True


class StandaloneEvent(SingleEvent):
    visiting_day = models.ForeignKey(
        VisitingDay,
        related_name='standalone_events',
        on_delete = models.CASCADE,
    )

class CompositeEvent (Event):
    visiting_day = models.ForeignKey(
        VisitingDay,
        related_name='composite_events',
        on_delete = models.CASCADE,
    )

class SubEvent(SingleEvent):
    composite_event = models.ForeignKey(
        CompositeEvent,
        related_name='sub_events',
        on_delete = models.CASCADE,
    )
