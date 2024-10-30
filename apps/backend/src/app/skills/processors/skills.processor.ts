import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Skills } from '../entities/skills.entity';
import { HeroSkill } from '../entities/heroSkill.entity';
import { CreateSkillDto } from '../dtos/CreateSkill.dto';
import { UpdateSkillDto } from '../dtos/UpdateSkill.dto';
import { LevelUpSkillDto } from '../dtos/LevelUpSkill.dto';
import { CastSkillDto } from '../dtos/CastSkill.dto';

@Processor('skills')
export class SkillsProcessor extends WorkerHost {
  constructor(
    @Inject('SKILLS_REPOSITORY')
    private readonly skillsRepository: Repository<Skills>,
    @Inject('HERO_SKILL_REPOSITORY')
    private readonly heroSkillRepository: Repository<HeroSkill>
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'create-skill': {
        return await this.handleCreateSkillJob(job.data);
      }
      case 'update-skill': {
        return await this.handleUpdateSkillJob(job.data);
      }
      case 'delete-skill': {
        return await this.handleDeleteSkillJob(job.data);
      }
      case 'get-all-skills': {
        return await this.handleGetAllSkillsJob(job.data);
      }
      case 'get-my-skills': {
        return await this.handleGetMySkillsJob(job.data);
      }
      case 'level-up-skill': {
        return await this.handleLevelUpSkillJob(job.data);
      }
      case 'cast-skill': {
        return await this.handleCastSkillJob(job.data);
      }
      case 'reduce-cooldown': {
        return await this.handleReduceCooldownJob(job.data);
      }
    }
  }

  private async handleReduceCooldownJob(data: {
    heroId: string;
  }): Promise<HeroSkill[]> {
    const { heroId } = data;

    const skills = await this.heroSkillRepository.find({
      where: { heroId },
      relations: ['skill'],
    });

    const updatedSkills = skills.map((skill) => {
      if (skill.cooldownTurnsLeft > 0) {
        skill.cooldownTurnsLeft -= 1;
      }
      return skill;
    });

    return await this.heroSkillRepository.save(updatedSkills);
  }

  private async handleCastSkillJob(data: {
    castSkillDto: CastSkillDto;
  }): Promise<HeroSkill> {
    const { castSkillDto } = data;

    const skill = await this.heroSkillRepository.findOne({
      where: { id: castSkillDto.skillId },
      relations: ['skill'],
    });
    if(skill.cooldownTurnsLeft > 0) return skill;
    skill.cooldownTurnsLeft = skill.skill.cooldown;
    return await this.heroSkillRepository.save(skill);
  }

  private async handleCreateSkillJob(data: {
    createSkillDto: CreateSkillDto;
  }): Promise<Skills> {
    const { createSkillDto } = data;

    const newSkill = await this.skillsRepository.create(createSkillDto);

    const result = await this.skillsRepository.save(newSkill);
    return result;
  }

  private async handleUpdateSkillJob(data: {
    updateSkillDto: UpdateSkillDto;
  }): Promise<Skills> {
    const { updateSkillDto } = data;

    await this.skillsRepository
      .createQueryBuilder()
      .update(Skills)
      .set(updateSkillDto)
      .where('id = :id', { id: updateSkillDto.id })
      .execute();

    const skill = await this.skillsRepository.findOne({
      where: { id: updateSkillDto.id },
    });

    return skill;
  }

  private async handleDeleteSkillJob(data: {
    skillId: number;
  }): Promise<string> {
    const { skillId } = data;

    await this.skillsRepository
      .createQueryBuilder()
      .delete()
      .from(Skills)
      .where('id = :id', { id: skillId })
      .execute();

    return 'Skill deleted successfully';
  }

  private async handleGetAllSkillsJob(data: {
    heroId: string;
  }): Promise<HeroSkill[]> {
    const { heroId } = data;

    const heroSkills = await this.heroSkillRepository.find({
      where: { heroId },
      relations: ['skill'],
    });

    const allSkills = await this.skillsRepository.find();

    const exisitingSkills = heroSkills.map((hs) => hs.skill.id);

    const newHeroSkills = [];

    for (const skill of allSkills) {
      if (!exisitingSkills.includes(skill.id)) {
        const newSkill = this.heroSkillRepository.create({
          heroId,
          skill,
          level: 0,
        });
        newHeroSkills.push(newSkill);
      }
    }
    if (newHeroSkills.length) {
      await this.heroSkillRepository.save(newHeroSkills);
    }

    return await this.heroSkillRepository.find({
      where: { heroId },
      relations: ['skill'],
    });
  }

  private async handleGetMySkillsJob(data: {
    heroId: string;
  }): Promise<HeroSkill[]> {
    const { heroId } = data;

    const heroSkills = await this.heroSkillRepository.find({
      where: { heroId, level: MoreThanOrEqual(1) },
      relations: ['skill'],
    });

    return heroSkills;
  }

  private async handleLevelUpSkillJob(data: {
    levelUpSkillDto: LevelUpSkillDto;
  }): Promise<HeroSkill> {
    const { levelUpSkillDto } = data;

    const heroSkill = await this.heroSkillRepository.findOne({
      where: { heroId: levelUpSkillDto.heroId, id: levelUpSkillDto.skillId },
      relations: ['skill'],
    });

    heroSkill.level += 1;
    await this.heroSkillRepository.save(heroSkill);

    return heroSkill;
  }
}
