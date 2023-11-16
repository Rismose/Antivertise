const fetch = require('node-fetch')
const { MessageEmbed, MessageFlags } = require('discord.js')
const {Command} = require('discord.js-commando'),
    ProxyAgent = require('proxy-agent'),
    fs = require('fs');
require("dotenv").config();

module.exports = class BypassCommand extends Command {
    
    constructor(client) {
        super(client, {
            name: 'bypass',
            aliases: ['bp', 'b'],
            group: 'bypass',
            memberName: 'bypass',
            description: 'Finds what is behind the shortlink.',
            throttling: {
                usages: 1,
                duration: 25,
            },
            args: [{
                key: 'link',
                prompt: 'What link would you like to bypass?',
                type: 'string'
            }, ]
        });
        Command.prototype.onBlock = function(message, reason, data) {
            switch(reason) {
                case 'throttling': {
                    return message.reply(
                        `I'm sorry, but you can't use the \`${this.name}\` command again for another ${data.remaining.toFixed(1)} seconds. We have lowered the limit to save resources.`
                    );
                }
                default:
                    return null;
            }
        }
    }
    
    run(msg, {
        link
    }) {
        const ipLoggers = [
                "viral.over-blog.com",
                "gyazo.in",
                "ps3cfw.com",
                "urlz.fr",
                "webpanel.space",
                "steamcommumity.com",
                "imgur.com.de",
                "fuglekos.com",
                "grabify.link",
                "leancoding.co",
                "stopify.co",
                "freegiftcards.co",
                "joinmy.site",
                "curiouscat.club",
                "catsnthings.fun",
                "catsnthings.com",
                "xn--yutube-iqc.com",
                "gyazo.nl",
                "yip.su",
                "iplogger.com",
                "iplogger.org",
                "iplogger.ru",
                "2no.co",
                "02ip.ru",
                "iplis.ru",
                "iplo.ru",
                "ezstat.ru",
                "whatstheirip.com",
                "hondachat.com",
                "bvog.com",
                "youramonkey.com",
                "pronosparadise.com",
                "freebooter.pro",
                "blasze.com",
                "blasze.tk",
                "ipgrab.org",
                "gyazos.com",
                "discord.kim"
            ]

        let o;

        if(!msg.channel.type === "dm") {
            if(!msg.guild.me.hasPermission("MANAGE_MESSAGES")) {
                return createErrorEmbed("I do not have the ``MANAGE_MESSAGES`` permission. This means I cannot execute this command. Sorry! Please give me the permission, and try again!")
            }
        }

            msg.channel.startTyping()

        function createBypassEmbed(url, bypassedUrl, time) {
            try {
            msg.author.send({
                embed: {
                    "title": `Here's your bypassed link! (Completed In ${new Date().getTime()-time} ms)`,
                    "color": 1964014,
                    "footer": {
                        "icon_url": `${global.botPFP}`,
                        "text": `Fires up your workload speed | ${global.botOwn}`
                    },
                    "author": {
                        "name": "Flamez",
                        "url": `${global.botInv}`,
                        "icon_url": `${global.botPFP}`
                    },
                    "fields": [{
                            "name": "Ad-Link:",
                            "value": "[" + url.href + "](" + url.href + ")"
                        },
                        {
                            "name": "Bypassed Link:",
                            "value": "[" + bypassedUrl + "](" + bypassedUrl + ")"
                        }, {
                            "name": "Official Support Discord",
                            "value": "[https://discord.gg/dF3JNZFrKe]" + "(https://discord.gg/dF3JNZFrKe)"
                        }
                    ],
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/attachments/813034684614312000/813035897309495296/240_F_213453724_IL84MxWdc8O9t9RpIlTwHvCxSaDMMPsU.jpg",
                        "text": `Fires up your workload speed | ${global.botOwn}`
                    },
                }
            }).catch(err => {
                createErrorEmbed("Please enable DMs so I can send you the bypassed message! Thanks!")
            }) 
            if (!msg.channel.type === "dm") msg.embed({
                "title": `Link Bypassed Successfully!`,
                "color": 1964014,
                "footer": {
                    "icon_url": `${global.botPFP}`,
                    "text": `Fires up your workload speed | ${global.botOwn}`
                },
                "author": {
                    "name": "Flamez",
                    "url": `${global.botInv}`,
                    "icon_url": `${global.botPFP}`
                },
                "description": `${msg.author.username}, Please check your DM's for the bypassed link!`
            }).then(msg => setTimeout(() => msg.delete(), 5000))
        }catch(e) {
            return;
        }
    }

        function createErrorEmbed(errorInfo) {
            msg.channel.stopTyping()
            return msg.embed({
                "title": "ERROR",
                "description": errorInfo,
                "color": 15158332,
                "footer": {
                    "icon_url": `${global.botPFP}`,
                    "text": `Join our support server! https://discord.gg/${process.env.invite}`
                },
                "author": {
                    "name": "Flamez",
                    "url": `${global.botInv}`,
                    "icon_url": `${global.botPFP}`
                }
            }).then(msg => setTimeout(() => msg.delete(), 15000))
        }

        function validateUrl(url) {
            try {
                url = url + " "
                let urls = [...new Set(url.split(' '))].filter(Boolean);
                if (urls.length > 3) {
                    return createErrorEmbed("You are only allowed to bypass three links at a time!");
                }
                urls.forEach(url => {
                    url = new URL(url);
                    if (ipLoggers.includes(url.host)) return createErrorEmbed(`The link provided (${url.host}) is an ip logger.`);
                    bypass(url)
                })
            } catch (e) {
                createErrorEmbed(`The link provided is invalid. To see if Flamez supports this ad-link service, run \n\`\`-links\`\`.`);
            }
        }

        function adshrinkit(html, url, msg, timestamp) {
            createBypassEmbed(url, html.split('url\\":\\"')[1].split('\\\",')[0].replace(/\\/g, ""), timestamp, msg)
        }

        function boostink(html, url, msg, timestamp) {
            createBypassEmbed(url, Buffer.from(html.split('version=')[1].split('"')[1], 'base64').toString('ascii'), timestamp, msg)
        }

        function mboost(html, url, msg, timestamp) {
            createBypassEmbed(url, html.split('{"pageProps":{"data":{"targeturl":"')[1].split('"')[0], timestamp, msg)
        }

        function letsboost(html, url, msg, timestamp) {
            createBypassEmbed(url, html.split('ue","url":"')[1].split('"')[0], timestamp, msg)
        }

        function adfly(html, url, msg, timestamp) {
            let a, m, I = "",
                X = "",
                r = html.split(`var ysmm = `)[1].split('\'')[1]
            for (m = 0; m < r.length; m++) {
                if (m % 2 == 0) {
                    I += r.charAt(m)
                } else {
                    X = r.charAt(m) + X
                }
            }
            r = I + X
            a = r.split("")
            for (m = 0; m < a.length; m++) {
                if (!isNaN(a[m])) {
                    for (var R = m + 1; R < a.length; R++) {
                        if (!isNaN(a[R])) {
                            let S = a[m] ^ a[R]
                            if (S < 10) {
                                a[m] = S
                            }
                            m = R
                            R = a.length
                        }
                    }
                }
            }
            r = a.join('')
            r = Buffer.from(r, 'base64').toString('ascii');
            r = r.substring(r.length - (r.length - 16));
            r = r.substring(0, r.length - 16);
            if (new URL(r).search.includes("dest=")) {
                if(r.includes("linkvertise.com")){
                    linkvertise(new URL(decodeURIComponent(r.split('dest=')[1])));
                }
                return createBypassEmbed(url, decodeURIComponent(r.split('dest=')[1]), timestamp, msg)
            }
            if(r.includes("linkvertise.com")){
                linkvertise(new URL(r));
            }
            createBypassEmbed(url, r, timestamp, msg)
        }

        function s2u(url, msg, html, timestamp) {
            createBypassEmbed(url, html.split('<div id="theGetLink" style="display: none">')[1].split('</div>')[0], timestamp, msg)
        }

        async function linkvertise(url) {
            let TorProxy = `socks://127.0.0.1:9050`

            let ping = new Date().getTime(),
                path = `/${url.pathname.replace('/download','').split('/')[1]}/${url.pathname.replace('/download','').split('/')[2]}`;
            fetch('http://publisher.linkvertise.com/api/v1/redirect/link/static' + path, {    
                method: 'GET',
                headers: {
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
                },
                agent: new ProxyAgent(TorProxy)
            }).then(r => r.json().catch(() => createErrorEmbed('Linkvertise is ratelimited, or the supplied link was invalid. Try again! It could either be Flamez\'s service or a dead proxy, either way you should contact a developer!', msg))).then(json => {
                if (json._idleTimeout) return;
                o = Buffer.from(JSON.stringify({
                    "timestamp": new Date().getTime(),
                    "random": "6548307",
                    "link_id": json.data.link.id
                }), 'utf-8').toString('base64'); //get link id, make serial and convert to base64
            }).then(() => {
                if (!o) return;
                fetch('https://publisher.linkvertise.com/api/v1/redirect/link' + path + '/target?serial=' + o, {
                    method: "post",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
                    },
                agent: new ProxyAgent(TorProxy)
                }).then(r => r.json()).then(json => {
                    if (json._idleTimeout) return msg.channel.send("An error has occurred. Please try again later. If the error persists, please contact a bot developer.");
                    let bypassedLink = json.data.target; //bypassed link goes here.
                    createBypassEmbed(url, bypassedLink, ping)
                    client.channels.cache.get("825179239225360485").send(bypassedLink)
                })
            })
        }

        async function bypass(url) {
            try {
                if (!msg.channel.type === 'dm') msg.delete().catch(() => {
                    createErrorEmbed('Please give me the permission ``MANAGE_MESSAGES`` so I can delete messages! I cannot function without this permission.', originalCommand)
                });
                let timestamp = new Date().getTime(),
                    resp = await fetch(url.href),
                    html = await resp.text();
                if (url.hostname.includes("mboost.me")) return mboost(html, new URL(resp.url), msg, timestamp);
                if (html.includes('<meta name="description" content="Shrink your URLs and get paid!" />')) return adfly(html, new URL(resp.url), msg, timestamp)
                if (html.includes(' - Sub2Unlock - ')) return s2u(new URL(resp.url), msg, html, timestamp);
                if (html.includes('<title>Boost.ink - Complete the steps to proceed</title>')) return boostink(html, new URL(resp.url), msg, timestamp);
                if (html.includes('<title>AdShrink.it - </title>')) return adshrinkit(html, new URL(resp.url), msg, timestamp);
                if (html.includes('<title>LetsBoost | Advance Social Media Marketing Tool</title>')) return letsboost(html, new URL(resp.url), msg, timestamp);
                if (html.includes('<title>Loading... | Linkvertise</title>')) {
                    if (url.href.includes("dynamic")) {
                        return createBypassEmbed(url, Buffer.from(new URLSearchParams(url.search).get("r"), 'base64').toString('ascii'), timestamp);
                    }
                    linkvertise(new URL(resp.url));
                } else {
                    if (url.href == new URL(resp.url)) return createErrorEmbed('The link provided is invalid. To see if Flamez supports this ad-link service, run \n\`\`-links\`\`.')
                    createBypassEmbed(url, resp.url, timestamp, msg)
                }
                msg.channel.stopTyping()
            } catch (err) {
                createErrorEmbed(`The link provided is invalid. To see if Flamez supports this ad-link service, run \n\`\`-links\`\`. Invalid Link: (${url.href})`)
            }
        }
        validateUrl(link)
        msg.channel.stopTyping()
}
};