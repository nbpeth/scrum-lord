# Scrumlord
## Behold, the world's only story point estimation tool
May your development team be unshackled from the burden of counting fingers or ad-bloated nonsense tools from the recesses of the internet.

Experience the real thing at https://s.crumlord.com

## Press
Scrumlord is a lightweight, ad-free story point estimation tool featuring:
* Private and public team rooms
* Lurker mode
* Real-time voting and reactions
* Flexible voting schemes
* Kick-ass animated backgrounds
* Voting timer
* Fireworks

<img width="1418" alt="image" src="https://github.com/nbpeth/scrum-lord/assets/10249534/ca9c1fc5-9c4a-4b4e-88bc-47fe26765039">
<img width="1433" alt="image" src="https://github.com/nbpeth/scrum-lord/assets/10249534/a40d5be8-4824-474d-900e-9b929f583aaf">

## What's inside
Scrumlord is as simple as I could think to make it
* React front-end
* Express server + websockets
* Postgres DB

You can deploy your own scrumlord with docker-compose, see below.

## Running locally
To run locally you need to start the API server and the UI development server. 

`yarn start:rs` start the UI application using the react-scripts development server
`yarn start:api:local` start the API server using local configuration. You must be running a local instance of Postgres on port 5432. You can run your own instance of Postgres locally, match configuration and execute the DDL found in `./api/db-ddl.sql` or you can use Docker and run `yarn start:api:dc` to launch a pre-configured PG instance.


## Disclaimer
Scrumlord is a hobby project. It's a delightful hot mess developed in stolen moments between the myriad of other things that one spends their life doing. If you find an issue, please report it here. https://github.com/nbpeth/scrum-lord/issues

If you want to add features or make changes, yeah sure, pop open a PR - I'd be happy to see some flow through.

Happy pointing!
