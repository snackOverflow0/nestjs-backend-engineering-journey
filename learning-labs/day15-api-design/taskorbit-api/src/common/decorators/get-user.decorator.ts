import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    if (data) {
      return request.user?.[data] // Returns a specific property if requested, like @GetUser('id')
    }
    return request.user // Returns the full user object
  }
)