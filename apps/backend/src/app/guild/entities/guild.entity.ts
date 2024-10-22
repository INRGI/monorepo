import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GuildParticipant } from "./guildParticipant.entity";

@Entity()
export class Guild {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    guildMastersId: string;

    @OneToMany(() => GuildParticipant, (guildParticipant) => guildParticipant.guild, {cascade: true})
    guildParticipants: GuildParticipant[];
}