from redis.asyncio import Redis

class RedisCache:
    def __init__(self, redis_url: str):
        self.redis = Redis.from_url(redis_url, decode_responses=True)

    # def set(self):
    #
    # def get(self):
    #
    # def delete(self):