# Project READ Frontend

## Setup

1. (Optional) Create a post merge hook for automatically updating secrets upon `git pull`
    ```bash
    ./scripts/setup.sh "kv/project-read" "main"
    ```
    Note: If you recieve permission denied errors, provide executable permissions on the setup script (Resolve using command below if you are on Mac OS)
    ```bash
    chmod +x ./scripts/setup.sh
    ```

### Add environment variables

1. Make a copy of `.env.sample` named `.env`
2. Pull secrets into `.env` by running
    ```bash
    vault kv get -format=json kv/project-read | python scripts/update_secret_files.py
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
