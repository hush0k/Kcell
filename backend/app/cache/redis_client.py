import json
from typing import Optional

from redis.asyncio import Redis

from app.config.config import settings


class RedisCache:
    def __init__(self):
        self.redis = Redis.from_url(settings.redis_url, decode_responses=True)
        self.cache_ttl_seconds = 3600

    async def set(self, key: str, value: dict) -> None:
        await self.redis.set(key, json.dumps(value), ex=self.cache_ttl_seconds)

    async def get(self, key: str) -> Optional[dict]:
        data = await self.redis.get(key)
        if data:
            return json.loads(data)
        return None


    async def delete(self, key:str) -> None:
        await self.redis.delete(key)
