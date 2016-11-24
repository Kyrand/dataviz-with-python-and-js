# Let's just use the local mongod instance. Edit as needed.

# Please note that MONGO_HOST and MONGO_PORT could very well be left
# out as they already default to a bare bones local 'mongod' instance.
import os

# We want to seamlessy run our API both locally and on Heroku. If running on
# Heroku, sensible DB connection settings are stored in environment variable MONGODB_URI
MONGO_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/nobel_prize')
#MONGO_DBNAME = 'nobel_prize'
X_DOMAINS = '*'
HATEOAS = False
PAGINATION = False

URL_PREFIX = 'api'
DOMAIN = {'winners_full':{
    'item_title': 'winners',
    'schema':{
        'country':{'type':'string'},
        'category':{'type':'string'},
        'name':{'type':'string'}, 
        'year':{'type': 'integer'},
        'gender':{'type':'string'},
        'mini_bio':{'type':'string'},
        'bio_image':{'type':'string'}
        },
    'url':'winners'
}}
