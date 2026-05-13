require('dotenv').config();

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running');
});

app.listen(PORT, () => {
    console.log(`Web server online at port ${PORT}`);
});

const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes,
    EmbedBuilder
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});


// =====================================
// THÔNG TIN NGÂN HÀNG
// =====================================

const BANK_ID = "TCB";
const ACCOUNT_NO = "19038739957018";
const ACCOUNT_NAME = "LE DINH THANH";


// =====================================
// BOT READY
// =====================================

client.once('ready', () => {

    console.log(`Bot online: ${client.user.tag}`);

});


// =====================================
// CHỐNG CRASH
// =====================================

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

client.on('shardDisconnect', () => {
    console.log('Bot disconnected');
});

client.on('shardReconnecting', () => {
    console.log('Bot reconnecting...');
});

client.on('shardResume', () => {
    console.log('Bot resumed connection');
});


// =====================================
// COMMAND /qr
// =====================================

client.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'qr') {

        try {

            const input = interaction.options.getString('input');

            const args = input.split(" ");

            const amount = args[0];

            const message = args.slice(1).join(" ");

            const qrUrl =
                `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(message)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

            const embed = new EmbedBuilder()

                .setTitle("💸 QR CHUYỂN KHOẢN")

                .setDescription(
`🏦 Ngân hàng: ${BANK_ID}

👤 Chủ tài khoản:
${ACCOUNT_NAME}

💳 Số tài khoản:
${ACCOUNT_NO}

💰 Số tiền:
${Number(amount).toLocaleString()} VNĐ

📝 Nội dung:
${message}`
                )

                .setImage(qrUrl)

                .setColor("#ff0000")

                .setFooter({
                    text: "Quét QR để chuyển khoản"
                });

            await interaction.reply({
                embeds: [embed]
            });

        } catch (error) {

            console.error(error);

            if (!interaction.replied) {

                await interaction.reply({
                    content: "❌ Có lỗi xảy ra",
                    ephemeral: true
                });

            }

        }

    }

});


// =====================================
// LOGIN
// =====================================

client.on('disconnect', () => {
    console.log('Bot disconnected!');
});

client.on('reconnecting', () => {
    console.log('Bot reconnecting...');
});

client.on('resume', () => {
    console.log('Bot resumed connection');
});

client.login(process.env.TOKEN).catch(console.error);
