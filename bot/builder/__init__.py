"""Module entrypoint.
"""

import asyncio
import logging

import aioredis
from discord.ext.commands import Bot
from discord.ext.commands import when_mentioned
from discord.ext.commands import CommandNotFound


class Builder(Bot):
    """The Builder bot."""

    def __init__(self, redis_url, **kwargs):
        """Initialize the bot."""

        # Establish a connection to Redis.
        loop = asyncio.get_event_loop()
        self.redis = loop.run_until_complete(
            aioredis.from_url(
                redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
        )

        # Continue with the usual initialization.
        super().__init__(command_prefix=when_mentioned, help_command=None, **kwargs)

    async def on_ready(self):
        """Discord Bot on ready."""

        # Log a message.
        logging.info("Logged in as %s#%s.", self.user.name, self.user.discriminator)

    async def on_command_error(self, context, exception):
        """Called when a command error is raised."""

        # If the error is that the command was not found, skip.
        if isinstance(exception, CommandNotFound):
            return

        # Otherwise, continue with the usual process.
        return await super().on_command_error(context, exception)
