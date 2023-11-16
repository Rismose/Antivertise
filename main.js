const fetch = require('node-fetch')

ProxyAgent = require('proxy-agent'),
fs = require('fs');

document.getElementById('getLinkButton').addEventListener("click", getLink);

function getLink() {
    var inputElement = document.getElementById('linkInput');
    var inputLink = inputElement.value;

    console.log(inputLink);
}

function showBypassedUrl(url, bypassedUrl, time) {
    let div = document.createElement('div');
    div.className = 'bypassedLink';
    div.innerHTML = `<a href="${url}" target="_blank">${url}</a> -> <a href="${bypassedUrl}" target="_blank">${bypassedUrl}</a> <span class="time">${time}</span>`;
    document.getElementById('bypassedLinks').appendChild(div);
}

function showErrors(url, error, time) {
    let div = document.createElement('div');
    div.className = 'error';
    div.innerHTML = `<a href="${url}" target="_blank">${url}</a> -> <span class="error">${error}</span> <span class="time">${time}</span>`;
    document.getElementById('bypassedLinks').appendChild(div);
}

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

function validateUrl(url) {
    try {
        url = inputLink + " "
        let urls = [...new Set(url.split(' '))].filter(Boolean);
        if (urls.length > 3) {
            return showErrors(`You are only allowed to bypass three links at a time.`);
        }
        urls.forEach(url => {
            url = new URL(url);
            if (ipLoggers.includes(url.host)) return `The link provided (${url.host}) is a known IP Logger`;
            bypass(url);
        })
    } catch (e) {
        return showErrors(`The link provided is invalid.`);
    }
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

    async function linkvertise(url) { // bypass code for linkvertise
        let TorProxy = `socks://127.0.0.1:9050` // Tor proxy

        let ping = new Date().getTime(),
            path = `/${url.pathname.replace('/download','').split('/')[1]}/${url.pathname.replace('/download','').split('/')[2]}`;
        fetch('http://publisher.linkvertise.com/api/v1/redirect/link/static' + path, {
            method: 'GET',
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
            },
            agent: new ProxyAgent(TorProxy)
        }).then(r => r.json().catch(() => showErrors("Linkvertise is ratelimited, or the supplied link was invalid. Try again!"))).then(json => {
            if (json._idleTimeout) return;
            o = Buffer.from(JSON.stringify({
                "timestamp": new Date().getTime(), // timestamp
                "random": "6548307", // random number
                "link_id": json.data.link.id // link id
            }), "utf-8").toString("base64"); // base64 encode the json
        }).then(() => {
            if (!o) return;
            fetch('https://publisher.linkvertise.com/api/v1/redirect/link' + path + '/target?serial=' + o, {
                method: "post",
                headers: {
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
                },
                agent: new ProxyAgent(TorProxy)
            }).then(r => r.json()).then(json => {
                if (json._idleTimeout) return showErrors("Linkvertise is ratelimited, or the supplied link was invalid. Try again!");
                let bypassedLink = json.data.target;
                showBypassedUrl(url, bypassedLink, new Date().getTime() - ping + 'ms');
                console.log(bypassedLink)
            })
        })
    }


    async function bypass(url) {
        try {
            let timestamp = new Date().getTime(),
                resp = await fetch(url.href),
                html = await resp.text();
            if (html.includes('<title>Loading... | Linkvertise</title>')) {
                if (url.href.includes("dynamic")) {
                    return showBypassedUrl(url, Buffer.from(new URLSearchParams(url.search).get("r"), 'base64').toString('ascii'), timestamp);
                }
                linkvertise(new URL(resp.url));
            } else {
                if (url.href == new URL(resp.url)) return showErrors('The link provided is invalid')
                showBypassedUrl(url, resp.url, new Date().getTime() - timestamp + 'ms');
            }
        } catch (err) {
            return showErrors('The link provided is invalid')
        }
    }
    validateUrl(link)