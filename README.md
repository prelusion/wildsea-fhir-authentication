# wildsea-fhir-authentication

To setup the Authentication server locally you have to do the following
```
1. Clone or fork this repository locally

2. Open up a Docker daemon, if this can't be done or you don't how install Docker Desktop.

3. Run the command "npm install", if this doesn't work install Node.
```
At this point most of the prerequites are done to start the server locally. Now you can either do the following:
1. Host the authentication server locally to manage the authentiation and accounts for client side applications.
2. Test the local environment or FHIR server.

## Host authentication server locally
Follow the following steps to get a local environment of the authentication server running. Expected to have done the prerequisites

```
1. Setup a .env file in the root of the repository and fill in the example variables located in .env.example.

2. Open up a terminal in the root of the project and run the following command "docker-compose up -d". This will create and build a MySQL image locally and start the DB in a docker container with the given environment variables.

3. Migrate the DB by doing the following command from the root of the repository "db-migrate up". If this doesn't work do the command on the actual bin of the migration library by doing "./node_modules/.bin/db-migrate up".
- The migration options are found undernether ./migrations/......

4. The database is migrated and running, now you can start the authentication server by running "npm run serve". This will run the server on given ${port}
```

To setup your own private & public key for this environment, push both the keys in the root of this repository. Note, gitignore these files if you don't want these keys to be put online.

The following configurations can be done:
```
- The port can be changed in server.ts, the default is port 3000
- The DB config can be changed in database.json (Note that if this is done you have to recreate the docker containers to apply these changes)
- Typescript or Tslint config can be changed in the tsconfig.json or .eslintrc.js
```

## Test the local environment or FHIR server.
Follow the following steps to test the local environment or given FHIR server. 

```
1. Setup a .env.test file in the root of the repository and fill in the example variables located in .env.example.

2. Open up a terminal in the root of the project and run the following command "docker-compose up -d". This will create and build a MySQL image locally and start the DB in a docker container with the given environment variables.

3. Migrate the DB by doing the following command from the root of the repository "db-migrate up -e test". If this doesn't work do the command on the actual bin of the migration library by doing "./node_modules/.bin/db-migrate up".
- The migration options are found undernether ./migrations/......
- NOTE (Notice that this is a different command than the one used for hosting the environent locally, other environment variables are used)

4. The database is migrated and running, now you can run "npm test" to run the tests located under ./test/....ts
```

The following configurations can be done:
```
- The FHIR server being tested can be changed in the fhir_api_handler.ts file under ./fhir/
- Tests can easily be added when necessary, see the test files for examples, and the easy to use API functions localted in fhir_api_handler.
```

To host this system or test this system in servers, use the exact same steps but then in the server hosted environment.

To get more information about the authentication server and it's implementations, choises and/or manuals see the documented files located in the given organisation of this repository.