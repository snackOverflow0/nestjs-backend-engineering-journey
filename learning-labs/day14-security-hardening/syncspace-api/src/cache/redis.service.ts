import { Injectable, OnModuleInit } from "@nestjs/common";

import { createClient } from "redis";

@Injectable()
export class RedisService
  implements OnModuleInit {
    private client

    async onModuleInit() {
        this.client = createClient({
          url: "redis://localhost:6379"
        })

        this.client.on(
          'error', (err) => {
            console.log('Redis error', err)
          }
        )

        await this.client.connect()
        
        console.log('Redis Connected')
    }

    // Save data
    async set(
      key: string,
      value: string,
      ttl?: number
    ) {
      if (ttl) {
        await this.client.set(
          key,
          value,
          {
            EX: ttl
          }
        )

        return
      }

      await this.client.set(
        key,
        value
      )
    }

    // READ DATA
    async get(
      key: string
    ) {
      return this.client.get(key)
    }

    // DELETE CACHE
    async del(
      key: string
    ) {
      return this.client.del(key)
    }
  }