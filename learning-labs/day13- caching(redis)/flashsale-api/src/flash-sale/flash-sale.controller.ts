import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('flash-sale')
export class FlashSaleController {
  constructor(
    private readonly flashSaleService: FlashSaleService
  ) {}

  @UseGuards(JwtGuard)
  @Post('buy/:productId')
  async buyProduct(
    @Req() req: any,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.flashSaleService.buyProduct(
      req.user.sub,
      productId,
    )
  }

  @Get('leaderboard')

  async getLeaderboard() {

    return this.flashSaleService
      .getLeaderboard();
  }

}
