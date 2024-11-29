import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RedisService } from '../services/redis.service';

@Processor('duel')
export class DuelProcessor extends WorkerHost {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'start-duel':
        return await this.handleStartDuelJob(job.data);
      case 'player-move':
        return await this.handleStartDuelJob(job.data);
    }
  }

  async handleStartDuelJob(data: { player1Id: string; player2Id: string }) {
    const { player1Id, player2Id } = data;

    await this.redisService.setGameData({
      player1: {
        id: player1Id,
        health: 10,
      },
      player2: {
        id: player2Id,
        health: 10,
      },
      currentTurn: player1Id,
      status: 'waiting',
    });
  }

  async handlePlayerMoveJob(data: {}) {}

  private calculateMoveResult(
    gameData,
    playerId: string,
    move: string,
    opponentId: string
  ) {
    const opponentMove =
      gameData[playerId === gameData.player1.id ? 'player2' : 'player1'].move;
    let result = '';

    if (move === opponentMove) {
      result = 'draw';
    } else if (
      (move === 'rock' && opponentMove === 'scissors') ||
      (move === 'paper' && opponentMove === 'rock') ||
      (move === 'scissors' && opponentMove === 'paper')
    ) {
      result = 'win';
      gameData[opponentId].health -= 1;
    } else {
      result = 'lose';
      gameData[playerId].health -= 1;
    }

    if (gameData[playerId].health <= 0 || gameData[opponentId].health <= 0) {
      gameData.status = 'finished';
      result = gameData[playerId].health <= 0 ? 'lose' : 'win';
    }

    return result;
  }
}
