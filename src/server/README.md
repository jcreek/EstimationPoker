# Web Sockets Server

## Deploying

Use Docker to deploy this.

Navigate to this folder and run `docker build -t estimation-ws-server .` to build the image.

Run it using `docker run -it --rm -p 8080:8080 estimation-ws-server`

## Deploying to Heroku

### Install the Heroku CLI

Download and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line).

If you haven't already, log in to your Heroku account and follow the prompts to create a new SSH public key.

`heroku login`

### Clone the repository

Use Git to clone `your-app-name`'s source code to your local machine.

`heroku git:clone -a your-app-name`
`cd your-app-name`

### Deploy your changes

Make some changes to the code you just cloned and deploy them to Heroku using Git.

`git add .`
`git commit -am "Your commit message"`
`git push heroku main`