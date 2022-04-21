"""API utilities.
"""

# External imports.
import os
from typing import Dict, Optional
import aiohttp

# Utility imports.
from builder.utils import auth0


def _get_base_url() -> str:
    """Get the API base URL.
    """

    return os.environ.get("API_BASE_URL", "http://localhost:3001")


async def get(url: str):
    """Wrapper for HTTP GET requests.
    """

    base_url = _get_base_url()
    token = await auth0.get_token()

    async with aiohttp.ClientSession(
        headers={"Authorization": f"Bearer {token}"}
    ) as session:
        async with session.get(f"{base_url}{url}") as response:
            return await response.json()


async def put(url: str, data: Optional[Dict[str, any]]):
    """Wrapper for HTTP PUT requests.
    """

    base_url = _get_base_url()
    token = await auth0.get_token()

    async with aiohttp.ClientSession(
        headers={"Authorization": f"Bearer {token}"}
    ) as session:
        async with session.put(f"{base_url}{url}", json=data) as response:
            return await response.json()


async def post(url: str, data: Optional[Dict[str, any]]):
    """Wrapper for HTTP POST requests.
    """

    base_url = _get_base_url()
    token = await auth0.get_token()

    async with aiohttp.ClientSession(
        headers={"Authorization": f"Bearer {token}"}
    ) as session:
        async with session.post(f"{base_url}{url}", json=data) as response:
            return await response.json()


async def delete(url: str):
    """Wrapper for HTTP DELETE requests.
    """

    base_url = _get_base_url()
    token = await auth0.get_token()

    async with aiohttp.ClientSession(
        headers={"Authorization": f"Bearer {token}"}
    ) as session:
        async with session.delete(f"{base_url}{url}") as response:
            return await response.json()
