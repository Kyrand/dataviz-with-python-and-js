# This is the accompanying code for Chapter 6: Heavyweight Scraping with Scrapy

To list the available spiders, just use `scrapy list ` from the commandline:

```
$ scrapy list

nwinners_full
nwinners_list
nwinners_minibio
```

The book was developed using the then Scrapy version 1.0.0. To find out which version you're using use the commandline:

```
$ scrapy version
2016-08-11 17:46:00 [scrapy] INFO: Scrapy 1.0.0 started (bot: nobel_winners)
2016-08-11 17:46:00 [scrapy] INFO: Optional features available: ssl, http11
2016-08-11 17:46:00 [scrapy] INFO: Overridden settings: {'NEWSPIDER_MODULE': 'nobel_winners.spiders', 'SPIDER_MODULES': ['nobel_winners.spiders'], 'HTTPCACHE_ENABLED': True, 'BOT_NAME': 'nobel_winners'}
Scrapy 1.0.0
```

*NOTE* - Scrapy version 1.1 seems to have broken the images pipeline. If you're having problems I suggest reverting to 1.0.0.

## Running the Spiders

To run the spiders go to the root directory and run the `scrapy crawl` command with the name of the spider:

```
$ scrapy crawl nwinners_full
2016-08-11 17:53:22 [scrapy] INFO: Scrapy 1.0.0 started (bot: nobel_winners)
2016-08-11 17:53:22 [scrapy] INFO: Optional features available: ssl, http11
2016-08-11 17:53:22 [scrapy] INFO: Overridden settings: {'NEWSPIDER_MODULE': 'nobel_winners.spiders', 'SPIDER_MODULES': ['nobel_winners.spiders'], 'HTTPCACHE_ENABLED': True, 'BOT_NAME': 'nobel_winners'}
2016-08-11 17:53:22 [scrapy] INFO: Enabled extensions: CloseSpider, TelnetConsole, LogStats, CoreStats, SpiderState
2016-08-11 17:53:22 [scrapy] INFO: Enabled downloader middlewares: HttpAuthMiddleware, DownloadTimeoutMiddleware, UserAgentMiddleware, RetryMiddleware, DefaultHeadersMiddleware, MetaRefreshMiddleware, HttpCompressionMiddleware, RedirectMiddleware, CookiesMiddleware, ChunkedTransferMiddleware, DownloaderStats, HttpCacheMiddleware
2016-08-11 17:53:22 [scrapy] INFO: Enabled spider middlewares: HttpErrorMiddleware, OffsiteMiddleware, RefererMiddleware, UrlLengthMiddleware, DepthMiddleware
2016-08-11 17:53:22 [scrapy] INFO: Enabled item pipelines:
2016-08-11 17:53:22 [scrapy] INFO: Spider opened
2016-08-11 17:53:22 [scrapy] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2016-08-11 17:53:22 [scrapy] DEBUG: Telnet console listening on 127.0.0.1:6023
2016-08-11 17:53:22 [scrapy] DEBUG: Redirecting (301) to <GET https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country> from <GET http://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country>
2016-08-11 17:53:22 [scrapy] DEBUG: Crawled (200) <GET https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country> (referer: None)
('Oops, no category in ', u'Alexis Carrel , Medicine, 1912')
...
2016-08-11 17:53:24 [scrapy] DEBUG: Scraped from <200 https://www.wikidata.org/wiki/Q78479>
{'born_in': '',
 'category': u'Physiology or Medicine',
 'country': u'Austria',
 'date_of_birth': u'7 March 1857',
 'date_of_death': u'27 September 1940',
 'gender': u'male',
 'link': u'http://en.wikipedia.org/wiki/Julius_Wagner-Jauregg',
 'name': u'Julius Wagner-Jauregg',
 'place_of_birth': u'Wels',
 'place_of_death': u'Vienna',
 'text': u'Julius Wagner-Jauregg , Physiology or Medicine, 1927',
 'year': 1927}
...
```

## The Moving target of Wikipedia

Wikipedia is changing all the time, which means some of the assumptions the spiders in the book were crafted on no longer apply. I'll aim to keep a list here, as changes to Wikipedia's URL conventions etc. break the spiders:

#### p183, Example 6-5
The URLs to Wikidata now include the hypertext transfer header 'https:' so the `parse_bio` method needs revising:
```
 if href:
-    request = scrapy.Request('https:' + href[0],
+    request = scrapy.Request(href[0],
```


## Errata!

#### p182, Example 6-4
In the `parse` method:

```
- for h2 in list(h2s)[:2]
+ for h2 in list h2s:
```
