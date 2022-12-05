# Intro
These instructions are written for and have been tested on an M1 Mac against macOS Ventura 13.0.1.  

Your mileage may vary, but feedback is welcome.

# Setup
## Install Docker
Everything critical will execute inside a Docker container.

There are a variety of ways to install Docker, but one of the easiest for macOS is to use [Homebrew](http://brew.sh/) and [Homebrew Cask](http://caskroom.io/).

> `brew cask install docker`
> 
> `open /Applications/Docker.app`

If you prefer, you may follow Docker's own directions to [install Docker](https://docs.docker.com/get-docker/).

## Install Node.js and npm
Follow these [instructions](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment).

You can go to the [Node.js home page](https://nodejs.org/en/) and select the Long-Term Support (LTS) recommended for most users (v18.12.1 at the time of writing).

Double-click on the installer, which should install both Node.js and npm (v8.19.2).

## Create an `.env` file

To run locally, create an `.env` file.  This will be read by the `dotenv` library to inject the environment variables into `process.env.<VARIABLE>` for use within our server.

My `.env` looks like this:

```
# Local
DB_NAME="postgres"
DB_PASSWORD="postgres"
DB_PORT=5432
DB_USER="postgres"
PORT=8080
```

In non-local environments, we'd inject these variables on a per-environment basis following [12-Factor App standards](https://12factor.net/config).

# Run

## Start the docker container

### Logs yay!

From the command line:

> `docker compose up`

This will bring up both the Postgres DB and server instances, and will show you logs for both on stdout.

To stop this docker, press `Ctrl-C`.

### Logs meh

If you'd prefer just to run in the background, you can run in detached mode:

> `docker compose up -d`

### Shut it off!

To bring them down:

> `docker compose down`

This brings down the container with the server and Postgres instances.

If instead you want to bring Docker down and remove any mounted volumes (including Postgres data):

> `docker compose down -v`

If you really need to kill Docker with fire, there's always this, but be extra careful, as it will wipe every other Docker image on your machine:

> `docker system prune -a -f --volumes`

This tells Docker to prune all images, containers, to force without prompting, and to delete any associated volumes.

## Navigation

- http://127.0.0.1:8080/ - landing page, main form
- http://127.0.0.1:8080/stats - stats page

# Test

Since I wanted to keep this simple for a proof-of-concept, you can run tests outside of Docker:

> `npm test`

If I were to extend this beyond a proof-of-concept, I'd move the tests into Docker itself so they may be executed on CI easily and against a production-like environment.

# Notes

## Design choices

The overarching theme here is that this is a proof-of-concept, so I didn't go overboard to exhaustively test every function and route, and I didn't build out to what we'd likely do for a production-ready version.

Examples of shortcuts:

- Write only unit tests and only against certain methods to show the general approach
- Use direct DB queries rather than going through specific data access objects or models
- No format checks on URL database columns
- Test outside Docker rather than inside
- Do not break routes or utilities out into smaller, more targeted files
- Keep just about everything at the root directory of the repo rather than creating a directory hierarchy, e.g., `src/models`, `src/config`, `src/config/db`, etc.
- Skip database transactions
- Do not handle extremely large amounts of data (e.g., paginating stats or otherwise chunking the CSV download)
- Do not guard against malware injection in URL's
- No auth
- Require both the original URL and short URL slug to be unique (we could allow multiple users to input the same original URL and just create a separate short URL slug apiece)
