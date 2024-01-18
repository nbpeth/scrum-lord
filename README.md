# Running locally

To run locally you need to start the API server and the UI development server. 

`yarn start:rs` start the UI application using the react-scripts development server

`yarn start:api:local` start the API server using local configuration. You must be running a local instance of Postgres on port 5432. You can run your own instance of Postgres locally, match configuration and execute the DDL found in `./api/db-ddl.sql` or you can use Docker and run `yarn start:api:dc` to launch a pre-configured PG instance.


