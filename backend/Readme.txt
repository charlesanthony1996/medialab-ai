FRONTEND STUFF

1. Make sure you have vite, vue3 installed
2. Node js installed
3. make sure your in the right "frontend" directory
4. do an npm install -> "npm install"
5. use the command -> "npm run dev" to run the project
6. no api keys needed for now


BACKEND STUFF

1. make sure your in the correct root(backend) directory
2. run the command -> pip install -r requirements.txt (This will make sure you install all dependencies for python on your machine)
3. then run the command -> python3 server.py OR (read how to run the project below (:point_down emoji))


HOW TO RUN THE PROJECT

1. the frontend is run by the command npm run dev
2. the backend is run by nodemon or python. the commands are as follows

--> nodemon server.py OR nodemon --exec python3 server.py (using nodemon, nodemon is an npm package, install it globally in your machine so you can use it locally.)

--> python3 server.py OR python server.py (based on whether you have any alias's attached, python automatically switches to python3 and not python2)


HOW TO SETUP THE EXTENSION THROUGH GOOGLE CHROME

1. open the google chrome browser
2. click on the button with the three vertical dots on the right hand corner
3. click extensions -> manage extensions
4. switch on developer mode on the top right hand corner of the application (the blue toggle button)
5. you should see the installed extensions here for your chrome application (nothing to do here. information "only" step)
6. click load unpacked. you should see your file explorer here
7. click frontend -> dist (select this directory and upload it) -> make sure you have run a vite build locally otherwise
    this would not work
8. you have uploaded the extension on developer mode now