from eve import Eve
import os

# some heroku-specific options
if 'PORT' in os.environ:
    port = int(os.environ.get('PORT'))
    # use '0.0.0.0' to ensure your REST API is reachable from all your
    # network (and not only your computer).
    host = '0.0.0.0'
else:
    port = 5000
    host = '127.0.0.1'

app = Eve()

if __name__=='__main__':
    # port = int(os.environ.get('PORT', 5000))
    app.run(host=host, port=port, debug=True)
