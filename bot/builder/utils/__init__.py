"""Utilities.
"""


class Singleton:
    """Singleton base class.
    """

    def __new__(cls, *args, **kwargs):
        """Override creating new singleton to prevent multiple instances.
        """

        instance = cls.__dict__.get("__it__")
        if instance is not None:
            return instance
        cls.__it__ = instance = object.__new__(cls)
        instance.init(*args, **kwargs)
        return instance

    def init(self, *args, **kwargs):
        """Custom init method due to issues using __init__.
        """
