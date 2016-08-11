# -*- coding: utf-8 -*-

# Scrapy settings for nobel_winners project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#
import os

BOT_NAME = 'nobel_winners'

SPIDER_MODULES = ['nobel_winners.spiders']
NEWSPIDER_MODULE = 'nobel_winners.spiders'

# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'nobel_winners (+http://www.yourdomain.com)'
# e.g., to 'impersonate' a browser':
#USER_AGENT = "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36"

HTTPCACHE_ENABLED = True
# ITEM_PIPELINES = {'scrapy.contrib.pipeline.images.ImagesPipeline': 1}
# We can define the ITEM_PIPELINES here or in their respective spiders by using the
# custom_settings variable (Scrapy v 1.0+) (see the nwinners_minibio spider for an example)
# For earlier versions of Scrapy (<1.0), define the ITEM_PIPELINES variable here:
# ITEM_PIPELINES = {'nobel_winners.pipelines.NobelImagesPipeline':1}
# We're storing the images in an 'images' subdirectory of the Scrapy project's root
IMAGES_STORE = 'images'
