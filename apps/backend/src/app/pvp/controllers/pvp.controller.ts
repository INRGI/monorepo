import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PvpService } from '../services/pvp.service';
import { CreateRoomDto } from '../dtos/CreateRoom.dto';
import { PvpRoom } from '../entities/PvpRoom.entity';

@Controller('pvp')
export class PvpController {
  constructor(private readonly pvpService: PvpService) {}

  @Post('create-room')
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<PvpRoom> {
    return await this.pvpService.createRoom(createRoomDto);
  }

  @Delete(':id')
  async deleteRoom(@Param('id') id: number): Promise<string>{
    return await this.pvpService.deleteRoom(id);
  }

  @Get()
  async findActiveRooms (): Promise<PvpRoom[]>{
    return await this.pvpService.findAllRooms();
  }
}
