require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('qr')
        .setDescription('Tạo QR chuyển khoản')
        .addStringOption(option =>
            option
                .setName('input')
                .setDescription('Ví dụ: 50000 napgame')
                .setRequired(true)
        )
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {

        console.log('Đang tạo slash command...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Đã tạo slash command');

    } catch (error) {

        console.error(error);

    }
})();