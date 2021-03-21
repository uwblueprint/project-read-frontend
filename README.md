# Project READ Frontend

## Setup

### Add environment variables

Make a copy of `.env.sample` named `.env`, and fill in:

- the URL your backend is running on
- your Django Admin username
- your Django Admin password

For example:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_USERNAME=test@uwblueprint.org
REACT_APP_PASSWORD=test
```

### Install dependencies

In the project directory, run `yarn`.

### Run in development mode

In the project directory, run `yarn start` to run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits, and you will also see any lint errors in the console.

## Lint

```
yarn run eslint --fix .
yarn prettier --write .
```
