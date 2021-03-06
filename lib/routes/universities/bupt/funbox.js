const config = require('@/config').value;
const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const cookie = config.btbyr.cookies;
    const url = config.btbyr.host;
    const response = await got({
        method: 'get',
        url: url + `log.php?action=funbox`,
        headers: {
            Referer: url,
            Cookie: cookie,
        },
    });
    const $ = cheerio.load(response.data);

    const list = $('td.outer > table > tbody')
        .slice(2)
        .map((i, e) => ({
            title: $(e).find('tr > td.rowfollow').eq(0).text(),
            pubDate: new Date($(e).find('tr > td.rowfollow > span').attr('title')).toUTCString(),
            description: $(e).find('tr > td.rowfollow').eq(2).html(),
            link: url + `log.php?action=funbox#` + new Date($(e).find('tr > td.rowfollow > span').attr('title')).getTime() / 1000,
        }))
        .get();

    ctx.state.data = {
        title: 'BYRBT - 趣味盒',
        link: url + `log.php?action=funbox`,
        item: list,
    };
};
