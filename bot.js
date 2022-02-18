const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token, dataURL } = require('./config.js');
const mongoose = require('mongoose')

const wait = require('util').promisify(setTimeout);

const client = new Client({ intents: [Intents.FLAGS.GUILDS,
	 Intents.FLAGS.GUILD_MEMBERS,
	  Intents.FLAGS.GUILD_PRESENCES,
	   Intents.FLAGS.GUILD_MESSAGES,
	    Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILDS
] });

const private = require('./data/private.js');
const { channel } = require('diagnostics_channel');

mongoose.connect(dataURL, {Modify: false
}).then(() => {
	console.info('Connected to the database!');
}).catch((err) => {
	console.warn(`MongoDB Err: `+err);
})

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
client.on('messageCreate', async msg => {
	if(msg.author.bot) return
	if(msg.channel.id === '944010412490366997'){
		setTimeout( async function() {
			msg.delete()
		}, 2000)
	}
})
client.on('interactionCreate', async i => {

	if (i.isCommand()) {

	const command = client.commands.get(i.commandName);

	if (!command) return;

	try {
		await command.execute(client, i);
	} catch (error) {
		console.error(error);
		return i.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

if(i.isButton()) {
	// Блочит ошибку кнопки
	await i.deferUpdate();


	let buttonID = i.customId

	let noEmbed = new MessageEmbed()
	.setColor('#2f3136')
	.setAuthor({ name: `${i.user.tag} - Вы не находитесь в войсе!`, iconURL: `${i.user.displayAvatarURL()}`})

	let noperms = new MessageEmbed()
	.setColor('#2f3136')
	.setAuthor({ name: `${i.user.tag} - Вы не находитесь в своей комнате`, iconURL: `${i.user.displayAvatarURL()}`})
	//если пользователь не в войсе
	if(!i.member.voice.channel) return i.followUp({ embeds: [noEmbed], components: [], ephemeral: true })
	
	let perms = i.member.voice.channel.permissionsFor(i.user).has("MANAGE_CHANNELS")
	//если пользователь не имеет прав на канал
	if(!perms) return i.followUp({ embeds: [noperms], ephemeral: true})

	if(buttonID === 'edit'){

		let editEmbed = new MessageEmbed()
		.setColor('#2f3136')
		.setAuthor({ name: `${i.user.tag} - Напишите новое название канала!`, iconURL: `${i.user.displayAvatarURL()}`})

		
		const filter = m => (m.content.includes('discord') && m.author.id != client.user.id);
		const channel = i.channel;
		const collector = channel.createMessageCollector(filter, { time: 15000, max: 1 });
		i.followUp({ embeds: [editEmbed], components: [], ephemeral: true })

		collector.on('collect', async m => {

		let edited = new MessageEmbed()
		.setColor('#2f3136')
		.setAuthor({ name: `${i.user.tag} - Готово!`, iconURL: `${i.user.displayAvatarURL()}`})

			m.member.voice.channel.setName(m.content)
			m.delete()
			collector.stop()

		})


	} else if(buttonID === 'limit'){
		let limitEmbed = new MessageEmbed()
		.setColor('#2f3136')
		.setAuthor({ name: `${i.user.tag} - Введите количество слотов(0-99)!?!`, iconURL: `${i.user.displayAvatarURL()}`})

		
		const filter = m => (m.content.includes('discord') && m.author.id != i.user.id);

		const channel = i.channel;
		const collector = channel.createMessageCollector(filter,  );

		i.followUp({ embeds: [limitEmbed], components: [], ephemeral: true })

		collector.on('collect', async m => {

		let errlimit = new MessageEmbed()
		.setColor('#2f3136')
		.setAuthor({ name: `${i.user.tag} - Вы указали неверное количество слотов!`, iconURL: `${i.user.displayAvatarURL()}`})

			if ((isNaN(m.content) || Math.abs() > 99)) {
				 m.reply({ embeds: [errlimit], ephemeral: true}) 
				 m.delete()
				}

			m.member.voice.channel.setUserLimit(Math.abs(m.content))
			m.delete()
			collector.stop()
		})


	} else if(buttonID === 'close'){
		let closed = new MessageEmbed()
		.setColor('#2f3136')
		.setAuthor({ name: `${i.user.tag} - Успешно!`, iconURL: `${i.user.displayAvatarURL()}`})

		i.member.voice.channel.permissionOverwrites.edit("940536267861544960", { CONNECT: false });
		i.followUp({ embeds: [closed], components: [], ephemeral: true })
	} else if(buttonID === 'open'){
		let opened = new MessageEmbed()
		.setColor('#2f3136')
		.setAuthor({ name: `${i.user.tag} - Успешно!`, iconURL: `${i.user.displayAvatarURL()}`})

		i.member.voice.channel.permissionOverwrites.edit("940536267861544960", { CONNECT: true });
		i.followUp({ embeds: [opened], components: [], ephemeral: true }) 
	} else if(i.customId === 'ban') {
		let ban = new MessageEmbed()
		.setColor('#2f3136')
		.setAuthor({ name: `${i.user.tag} - укажите пользователя `, iconURL: `${i.user.displayAvatarURL()}`})
		i.followUp({ embeds: [ban], ephemeral: true })
		const filter = m => (m.content.includes('discord') && m.author.id != i.user.id);
		const channel = i.channel
	const collector = channel.createMessageCollector(filter,  )

	collector.on('collect', async m => {

		m.member.voice.channel.permissionOverwrites.edit(m.mentions.users.first(), { CONNECT: false });
		m.delete()
		collector.stop()
	
	})
}
if(i.customId === 'unban') {
	let ban = new MessageEmbed()
	.setColor('#2f3136')
	.setAuthor({ name: `${i.user.tag} - укажите пользователя `, iconURL: `${i.user.displayAvatarURL()}`})
	i.followUp({ embeds: [ban], ephemeral: true })
	const filter = m => (m.content.includes('discord') && m.author.id != i.user.id);
	const channel = i.channel
	const collector = channel.createMessageCollector(filter,  )

	collector.on('collect', async m => {

	m.member.voice.channel.permissionOverwrites.edit(m.mentions.users.first(), { CONNECT: true });
	m.delete()
	collector.stop()

})
} else if(i.customId === 'mute') {
        let ban = new MessageEmbed()
        .setColor('#2f3136')
        .setAuthor({ name: `${i.user.tag} - укажите пользователя `, iconURL: `${i.user.displayAvatarURL()}`})
        i.followUp({ embeds: [ban], ephemeral: true })
        const filter = m => (m.content.includes('discord') && m.author.id != i.user.id);
	const channel = i.channel
	const collector = channel.createMessageCollector(filter,  )
    collector.on('collect', async m => {

        m.member.voice.channel.permissionOverwrites.edit(m.mentions.users.first(), { SPEAK: false });
		m.mentions.users.first().setMute(true)
        m.delete()
		collector.stop()
    
    })
}

if(i.customId === 'unmute') {
    let ban = new MessageEmbed()
    .setColor('#2f3136')
    .setAuthor({ name: `${i.user.tag} - укажите пользователя `, iconURL: `${i.user.displayAvatarURL()}`})
    i.followUp({ embeds: [ban], ephemeral: true })
    const filter = m => (m.content.includes('discord') && m.author.id != i.user.id);
	const channel = i.channel
	const collector = channel.createMessageCollector(filter,  )
    collector.on('collect', async m => {

    m.member.voice.channel.permissionOverwrites.edit(m.mentions.users.first(), { SPEAK: true });
	m.mentions.users.first().setMute(false)
    m.delete()
	collector.stop()

})
}

}
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	if(newState.member.user.bot) return

	if(newState.channelId === '944010450268454973'){
		newState.guild.channels.create(`・` + oldState.member.user.username, {
			type: 'GUILD_VOICE',
			userLimit: 0,
			parent: '942078581528477736',
			permissionOverwrites: [{
				id: newState.id,
				allow: ['MANAGE_CHANNELS']
			}]
		}).then(
			async c => {
				newState.setChannel(c);
			})
	}
	const category = await client.channels.cache.get("942078581528477736");
	category.children.forEach(channel => {
		if (channel.members.size <= 0 && channel.id != "944010450268454973") {
			channel.delete()
		}
	})
})

process.on('unhandledRejection', (reason) => { console.log(reason) })

client.login(token)