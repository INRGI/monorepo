import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Guild } from "./guild.entity";

@Entity()
export class GuildParticipant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    heroId: string;

    @ManyToOne(() => Guild, (guild) => guild.guildParticipants, { onDelete: 'CASCADE' })
    guild: Guild;
}