# server.py
import flask
from flask import Flask, send_from_directory, render_template, redirect

import flask.ext.login as flask_login

app = Flask(__name__)

import os

# Try to find an NBVIZ_CONFIG environment variable - default is development
cfg_var = os.environ.get('NBVIZ_CONFIG', 'config.DevelopmentConfig')
# if not cfg_var:
#     raise RuntimeError('The environment variable NBVIZ_CONFIG is '
#                        'not set. Please set to enable configuration'
#                        )
    
app.config.from_object(cfg_var)

app.secret_key = 'special secret key-string'
# @app.route('/')
# def root():
#     return send_from_directory('.', 'index.html')
login_manager = flask_login.LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

users = {'groucho': {'pw': 'swordfish'}}

class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(name):
    
    if name not in users:
        return

    user = User()
    user.id = name
    return user


# @login_manager.request_loader
# def request_loader(request):
    
#     name = request.form.get('name')
#     if name not in users:
#         return

#     user = User()
#     user.id = name

#     # DO NOT ever store passwords in plaintext and always compare password
#     # hashes using constant-time comparison!
#     user.is_authenticated = request.form['pw'] == users[name]['pw']

#     return user   


@app.route('/login', methods=['GET', 'POST'])
def login():
    
    if flask.request.method == 'GET':
        return render_template('login.html')

    name = flask.request.form['name']
    if users.get(name) and flask.request.form['pw'] == users[name]['pw']:
        user = User()
        user.id = name
        flask_login.login_user(user)
        return flask.redirect(flask.url_for('root'))

    return '<h2>A Bad Login Attempt</h2><p>Wrong name and/or password given</p>'
    #return 'Bad login'


# @app.route('/protected')
# @flask_login.login_required
# def protected():
#     return 'Logged in as: ' + flask_login.current_user.id

    
@app.route('/logout')
def logout():
    flask_login.logout_user()
    return '<h2>Logged Out!</h2>'

    
@login_manager.unauthorized_handler
def unauthorized_callback():
    app.logger.debug('An unauthorized user!')
    return redirect('/login')

        
@app.route('/')
@flask_login.login_required
def root():
    return render_template('index.html')
    

winners = [
    {'name': 'Albert Einstein', 'category':'Physics'},
    {'name': 'V.S. Naipaul', 'category':'Literature'},
    {'name': 'Dorothy Hodgkin', 'category':'Chemistry'}
]

@app.route('/demolist')
def demo_list():
    return render_template('testj2.html',
                           heading="A little winners' list",
                           winners=winners
                           )
    
if __name__ == '__main__':
    app.run(debug=True, port=8000)
