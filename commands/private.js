const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const cfg = require('../config')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('private')
		.setDescription('priv'),
	async execute(client, interaction) {
        let pEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setTitle(`Управление приватной комнатой`)
        .setDescription(`Жми следующие кнопки, чтобы настроить свою комнату
        Использовать их можно только когда у тебя есть приватный канал`)
        .addField('** **', "<:prname:939174782333751388> - `Изменить название комнаты`\n<:prlimit:939174760313671802> - `Установить лимит пользователей` \n<:prlock:939174738113228801> - `Закрыть комнату для всех` \n<:prunlock:939174713744293998> - `Открыть комнату для всех` ", true)
        .addField('** **', "\n<:prban:939174670803034194> - `Ограничить доступ к комнате` \n <:prinvite:939174638137794590> - `Выдать доступ в комнату` \n<:prmute:939174609578786856> - `Забрать право общаться` \n<:prunmute:939174508420534282> - `Выдать право общаться` \n", true)

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('edit')
            .setEmoji('939174782333751388')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('limit')
            .setEmoji('939174760313671802')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('close')
            .setEmoji('939174738113228801')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('open')
            .setEmoji('939174713744293998')
            .setStyle('SECONDARY'),
        );

        const row2 = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('ban')
            .setEmoji('939174670803034194')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('unban')
            .setEmoji('939174638137794590')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('mute')
            .setEmoji('939174609578786856')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('unmute')
            .setEmoji('939174508420534282')
            .setStyle('SECONDARY'),
        )
        const filter = i => i.user.voice === user.voice
        const collector = interaction.channel.createMessageComponentCollector()

        collector.on('collect', async i => {


    })

        await interaction.reply({ embeds: [pEmbed], components: [row, row2] })
    },
}