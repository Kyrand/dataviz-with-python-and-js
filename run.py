from __future__ import print_function
import click
import json
from pymongo import MongoClient
from nobel_viz.api.settings import MONGO_URI

WINNERS_TABLE = 'winners_full'
NOBEL_DB = 'nobel_prize'

mc = MongoClient(MONGO_URI)
nobel_db = mc.get_default_database()


@click.group()
def cli():
    pass


@click.command()
def seed_db():
    """ Seed the MongoDB nobel_prize database with the winners' data."""
    winners = json.load(open('data/nobel_winners_biopic.json'))
    nobel_db[WINNERS_TABLE].drop()
    nobel_db[WINNERS_TABLE].insert(winners)

    print('Seeded the database with %d Nobel winners'%nobel_db[WINNERS_TABLE].count())

@click.command()
def drop_db():
    """ Drop the nobel_prize database from MongoDB."""
    mc.drop_database(NOBEL_DB)
    print('Dropped the %s database from MongoDB'%NOBEL_DB)


cli.add_command(seed_db)
cli.add_command(drop_db)


if __name__ == '__main__':
    cli()
