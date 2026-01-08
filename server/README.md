https://frozen-fortress-58087.herokuapp.com

Heroku Commands:

To run local app in Heroic:
heroku local -p 5555

To set the build pack for the app:  (not needed, done auto)
heroku buildpacks:set heroku/nodejs

To change remote Heroku app:
heroku git:remote -a frozen-fortress-58087

To deploy:
Push to git repo (our repo)
-- one time -- Heroku login
-- one time -- Heroku create (first time only?)
cd client, npm run build
Git push heroku main

View logs:
heroku logs --tail