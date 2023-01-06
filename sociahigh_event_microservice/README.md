### Handling with knex and migrations

#### Install the knex cli

```
npm i -g knex
```

#### Create a migration

```
knex migrate:make migration_name -x ts
```

#### Run the migrations

```sh
# Run all migrations:
knex migrate:latest

# Run only one migration:
knex migrate:up 001_migration_name.ts
```

#### Rollback the migrations

```sh
# Rollback all migrations:
knex migrate:rollback --all

# Rollback only one migration:
knex migrate:down 001_migration_name.js
```

### Installing husky, commitlint and commitizen to default commits

```sh
npm install --save-dev husky commitizen@latest @commitlint/config-conventional @commitlint/cli && \
  npx husky install && \
  npx commitizen init cz-conventional-changelog --save-dev --save-exact --force && \
  printf "module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ]
};" > commitlint.config.js && \
  npx husky add .husky/pre-commit 'npm run lint && npm run format && npm run test' && \
  npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1' && \
  npx husky add .husky/prepare-commit-msg 'exec < /dev/tty && npx cz --hook || true' && \
  npx --yes npm-add-script -k "prepare" -v "husky install"
```

### Running with docker in server
```sh
# Network is necessary
docker network create \
  --driver=bridge \
  --subnet=171.1.0.0/16 \
  sociahigh_network

# Build image
docker build -t sociahigh_event_microservice .

# Run container
docker run -d \
 --name sociahigh_event_microservice \
 --restart always \
 -p 8900:8900 \
 --ip 171.1.0.89 \
 --network sociahigh_network \
 sociahigh_event_microservice
```
