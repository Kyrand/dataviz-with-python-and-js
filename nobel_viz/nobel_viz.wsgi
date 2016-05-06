import sys
import os

sys.path.insert(0, '/var/www/nobel_viz')

activate_this = '/home/kyran/.virtualenvs/pyjsbook/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

os.environ["NBVIZ_CONFIG"] = "config.DevelopmentConfig"

from server import app as application
