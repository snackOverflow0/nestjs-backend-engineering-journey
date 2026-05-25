import { Injectable, OnModuleInit } from "@nestjs/common";
import { createClient } from "redis";

@Injectable()
export class RedisService
  implements OnModuleInit {
    private client

    async onModuleInit() {
      this.client = 
        createClient({
          url: 
            process.env.REDIS_URL
        })

      this.client.on(
        'error',
        (err) => {
          console.log(
            'Redis Error',
            err
          )
        }
      )

      await this.client.connect()

      console.log(
        'Redis Connected'
      )
    }

    async get(
      key: string
    ) {
      return this.client.get(key)
    }

    async set(
      key: string,
      value: any,
      ttl?: number
    ) {
      if (ttl) {
        return this.client.set(
          key,
          JSON.stringify(value),
          {
            EX: ttl,
          }
        )
      }

      return this.client.set(
        key,
        JSON.stringify(value)
      )
    }

    async del(
      key: string,
    ) {
      return this.client.del(key)
    }
  }