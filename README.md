This project was created with Create React App, Material-UI Firebase and Nginx.

To install the packages, first run `yarn` in the folder of the project.

Then, to run it in dev mode use `yarn start`. To run it in production mode use `yarn docker-start` (you will need to have Docker running on your machine) then go to http://192.168.99.100:8080. Use Chrome for a better experience.

Please note that in dev mode, hot updates are not working because I'm overriding the window.Promise object. You will need to reload the page manually to see the changes.
