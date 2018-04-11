# Microharmonic

## Setup

Create a postgres database with [this guide](https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb) and set `DATABASE_URL` in `.env`.

Then run:

```
psql -U <username> -f database.sql
```

## Running

Running the server on localhost:5000:

```
yarn install
yarn start
```

Running the client on localhost:3000:

```
cd client
yarn install
yarn start
```

Then go to localhost:3000

## Deployment

Install heroku-cli:

```
brew install heroku
```

Login:

```
heroku auth:login
```

Initialize heroku project in root dir:

```
heroku create
```

Pushing new code:

```
git push heroku master
```

## Contributing

See the [public trello board](https://trello.com/b/NAr6ByNU/tasks) for stories and tickets.
