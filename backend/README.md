Barn Burner NHL API Backend
========================
Here lives the Back Burner NHL API Backend App.



How it works
------------
This app will act as a wrapper and aggregator for existing NHL Stats APIs.
This data will then be delivered to the front-end for use and display.


Pre-requisites
--------------
```
docker
docker-compose
nodejs
npm
```


Setup Nodejs environment
------------------------
Setup the Nodejs environment:
```
npm install --save-dev
```


Deploying
---------
TODO: Dockerize this bad boy

This will start the backend API.
```
docker-compose up
```


Running the API Manually
-------------------
You can optionally manually run the API.
```
node app.js
```


Testing
-------
To run lint tests:
```
npm run lint
```
To run lint and FIX errors:
```
npm run lint-fix
```
To run unit tests
```
npm run tests
```


Contributing
--------------------
All outstanding issues or feature requests should be filed as Issues on this Github
page. PRs should be submitted against the master branch for any new features or changes,
and pass all testing above.
