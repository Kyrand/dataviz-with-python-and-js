import scrapy
import re

BASE_URL = 'http://en.wikipedia.org'


class NWinnerItemBio(scrapy.Item):
    link = scrapy.Field()
    name = scrapy.Field()
    mini_bio = scrapy.Field()
    image_urls = scrapy.Field()
    bio_image = scrapy.Field()
    images = scrapy.Field()


class NWinnerSpiderBio(scrapy.Spider):
    """ Scrapes the Nobel prize biography pages for portrait images and a biographical snippet """

    name = 'nwinners_minibio'
    allowed_domains = ['en.wikipedia.org']
    start_urls = [
        "http://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country?dfdfd"
    ]

    For Scrapy v 1.0+, custom_settings can override the item pipelines in settings
    custom_settings = {
        'ITEM_PIPELINES': {'nobel_winners.pipelines.NobelImagesPipeline':1},
    }

    def parse(self, response):

        filename = response.url.split('/')[-1]
        h2s = response.xpath('//h2')

        for h2 in h2s:
            country = h2.xpath('span[@class="mw-headline"]/text()').extract()
            if country:
                winners = h2.xpath('following-sibling::ol[1]')
                for w in winners.xpath('li'):
                    wdata = {}
                    wdata['link'] = BASE_URL + w.xpath('a/@href').extract()[0]

                    #print(wdata)
                    request = scrapy.Request(wdata['link'],
                                             callback=self.get_mini_bio,
                                             dont_filter=True)
                    request.meta['item'] = NWinnerItemBio(**wdata)
                    yield request


    def get_mini_bio(self, response):
        BASE_URL_ESCAPED = 'http:\/\/en.wikipedia.org'
        item = response.meta['item']
        # cache image
        item['image_urls'] = []

        # Get the URL of the winner's picture, contained in the infobox table
        img_src = response.xpath('//table[contains(@class,"infobox")]//img/@src')
        if img_src:
            item['image_urls'] = ['http:' + img_src[0].extract()]
        mini_bio = ''
        # Get the paragraphs in the biography's body-text
        ps = response.xpath('//*[@id="mw-content-text"]/p[text() or  normalize-space(.)=""]').extract()

        # Add introductory biography paragraphs till the empty breakpoint
        for p in ps:
            if p == '<p></p>':
                break
            mini_bio += p

        # correct for wiki-links
        mini_bio = mini_bio.replace('href="/wiki', 'href="' + BASE_URL + '/wiki')
        mini_bio = mini_bio.replace('href="#', 'href="' + item['link'] + '#')
        item['mini_bio'] = mini_bio
        yield item



    # def parse_bio(self, response):
    #     item = response.meta['item']
    #     bio_text = response.xpath('//div[@id="mw-content-text"]').extract()[0]
    #     item['gender'] = guess_gender(bio_text)
    #     persondata_table = response.xpath('//table[@id="persondata"]')
    #     if persondata_table:
    #         get_persondata(persondata_table[0], item)
    #     else:
    #         item['gender'] = None
    #     yield item
