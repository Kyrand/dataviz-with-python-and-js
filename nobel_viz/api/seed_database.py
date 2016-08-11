from __future__ import print_function
import json
from pymongo import MongoClient
from settings import MONGO_URI

WINNERS = 'winners'

winners = json.load(open('data/nobel_winners_biopic.json'))
mc = MongoClient(MONGO_URI)
db = mc.get_default_database()

db[WINNERS].drop()
db[WINNERS].insert(winners)

print('Seeded the database with %d Nobel winners'%db.winners.count())
