import nobel_viz
import unittest


class NVIzTestCase(unittest.TestCase):

    def setUp(self):
        nobel_viz.app.config['TESTING'] = True
        self.app = nobel_viz.app.test_client()

    def tearDown(self):
        pass

    def login(self, name, password):
        return self.app.post('/login', data=dict(
            name=name, pw=password
            ), follow_redirects=True)

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

    # TESTS
    def test_login_logout(self):
        # login with valid name and password
        resp = self.login('groucho', 'swordfish')
        # check we've been redirected to Nobel-viz page
        assert nobel_viz.app.config['APP_TITLE'] in resp.data 
        resp = self.logout()
        assert 'Logged Out!' in resp.data 
        # login with invalid name and password
        resp = self.login('chico', 'shark')
        assert 'Bad Login Attempt' in resp.data 
        

if __name__ == '__main__':
    unittest.main()
