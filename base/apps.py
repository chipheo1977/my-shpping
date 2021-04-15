from django.apps import AppConfig


class BaseConfig(AppConfig):
    name = 'base'

    # cau hinh signals.py
    def ready(self):
        import base.signals