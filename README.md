# hackerbay_backend
This is a node.js project as per the requirements of the hackerbay backend task.

To run the application, you simply need to run "npm run start",
To run the tests, you simply need to run "npm run test"

The /login endpoint takes an object with a username/password combo and returns a token

The token is then attached to the header for the subsequent calls

the /patch endpoint takes in 2 objects, json/patchObj and it applies the patch to the json passed
and returns that json

the /thumbnail endpoint takes in a url to an image and returns a base64 encoded thumbnail of that image

The tests are exhaustive touching on the fringe cases also.

The standard library was used for linting, because who doesn't like clean code.

it has been dockerized and here is a link to the docker: https://hub.docker.com/r/abubakarsambo/hackerbay/

Swagger link: https://app.swaggerhub.com/apis/sam57/hackerbay/1.0.0
