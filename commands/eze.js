const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const cfg = require('../config')
let marryCost = cfg.marryCost


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pr')
		.setDescription('View love profile'),
	async execute(client, interaction) {

        let uid = interaction.user.id
        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('edit')
				.setLabel(`Изменить статус`)
				.setStyle('SECONDARY'),
			);

        const profileEmbed = new MessageEmbed()
        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
        .setTitle(`Профиль ${interaction.user.tag}`)
        .addField(`> Статус`, "```"+`Не установлен`+"```")
		.setThumbnail(interaction.user.displayAvatarURL())
		.setColor('#2f3136')

        await interaction.reply({ embeds: [profileEmbed], components: [row] })
        const filter = i => i.user.id === uid;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', async i => {
			await i.deferUpdate();
			if (i.customId === 'edit'){
                i.editReply({ content: `<@${i.user.id}> введи свой статус`, embeds: [], components: []});

                const mfilter = m => m.content.includes('discord');
                const mcollector = interaction.channel.createMessageCollector({ mfilter, time: 15000, max: 1 });

                mcollector.on('collect', async m => {
                    m.reply({ content: `<@${i.user.id}> ваш статус: "${m.content}"`})
                    console.log(`Collected ${m.content}`);
                })
                
            }
        })

    },
}