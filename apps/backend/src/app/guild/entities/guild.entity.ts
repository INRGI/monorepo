import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GuildParticipant } from "./guildParticipant.entity";
import { GuildBoss } from "./guildBoss.entity";

@Entity()
export class Guild {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: 'https://i.pinimg.com/originals/57/ed/3b/57ed3b5c113d60d1fa0eced7e2e37357.png'})
    logo: string;

    @Column()
    guildMastersId: string;

    @ManyToOne(() => GuildBoss, (guildBoss) => guildBoss.guild, { onDelete: 'CASCADE' })
    boss: GuildBoss

    @OneToMany(() => GuildParticipant, (guildParticipant) => guildParticipant.guild, {cascade: true})
    guildParticipants: GuildParticipant[];
}