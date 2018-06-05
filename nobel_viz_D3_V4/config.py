class Config(object):
    APP_TITLE = 'Visualizing the Nobel Prize'
    DEBUG = False
    TESTING = False
    DATABASE_URI = 'sqlite://:memory:'
    EVE_API = 'http://localhost:5000/api/'

class ProductionConfig(Config):
    DATABASE_URI = 'mysql://user@localhost/foo'
    EVE_API = 'http://foo.com:5000/api/'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
