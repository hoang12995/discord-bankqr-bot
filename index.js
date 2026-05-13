require('dotenv').config();

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Bot is running');
});

const PORT = process.env.PORT || 3000;

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


// ======================================
// THÔNG TIN NGÂN HÀNG
// ======================================

const BANK_ID = "TCB";
const ACCOUNT_NO = "19038739957018";
const ACCOUNT_NAME = "LE DINH THANH";


// ======================================
// BOT ONLINE
// ======================================

client.once('ready', () => {

    console.log(`Bot online: ${client.user.tag}`);

});


// ======================================
// LỆNH /qr
// ======================================

client.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'qr') {

        try {

            // ví dụ:
            // /qr 50000 napgame

            const input = interaction.options.getString('input');

            const args = input.split(" ");

            const amount = args[0];

            const message = args.slice(1).join(" ");

            // LINK QR

            const qrUrl =
                `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(message)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

            // EMBED

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

            await interaction.reply({

                content: "❌ Có lỗi xảy ra",

                ephemeral: true

            });

        }

    }

});


// ======================================
// LOGIN BOT
// ======================================

client.login(process.env.TOKEN);


// ======================================
// TẠO SLASH COMMAND
// ======================================

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

].map(command => command.toJSON());


// ======================================
// ĐĂNG KÝ COMMAND
// ======================================

const rest = new REST({ version: '10' })

    .setToken(process.env.TOKEN);

(async () => {

    try {

        console.log('Đang tạo slash command...');

        await rest.put(

            Routes.applicationCommands(
                process.env.CLIENT_ID
            ),

            { body: commands }

        );

        console.log('Đã tạo slash command');

    } catch (error) {

        console.error(error);

    }

})();