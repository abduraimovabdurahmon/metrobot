const { Telegraf } = require("telegraf");
const metros = require("./data/metros.js");
const { getDistance } = require("geolib");

const bot = new Telegraf("7115590106:AAG4XWzjeNGLg6NNzjdUX0BAUwEM7EOI6pU");

function findNearestMetro({latitude, longitude}, metros) {
    try {
        let nearestMetro = metros[0];
        let nearestDistance = getDistance(
            {latitude, longitude},
            {latitude: nearestMetro.coordinates.latitude, longitude: nearestMetro.coordinates.longitude}
        );

        metros.forEach(metro => {
            let distance = getDistance(
                {latitude, longitude},
                {latitude: metro.coordinates.latitude, longitude: metro.coordinates.longitude}
            );
            if (distance < nearestDistance) {
                nearestMetro = metro;
                nearestDistance = distance;
            }
        });

        return nearestMetro;
    } catch (error) {
        console.log(error);
    }
}


bot.start((ctx) => {
  ctx.replyWithHTML(
    `<b>Assalomu alaykum ${ctx?.from?.first_name}!</b>\n\nMenga telegram orqali joylashuvni yuboring va men joylashuvingizga eng yaqin metro stansiyasini topib beraman!`
  );
});

bot.on("location", (ctx) => {
    try {
        console.log(ctx.message.location);
        const nearestMetro = findNearestMetro(ctx.message.location, metros);
        console.log(nearestMetro);

        ctx.replyWithHTML(
            `Joylashuv uchun eng yaqin bekat bu: <b>${nearestMetro.route}ning ${nearestMetro.name}</b>`
        );

    } catch (error) {
        console.log(error);
    }
});

bot.launch();
