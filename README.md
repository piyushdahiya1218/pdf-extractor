# pdf-extractor

### This is the frontend of project PDF Extractor, here is the link of backend - https://github.com/piyushdahiya1218/pdf-extractor-server

Steps to setup the frontend - 
1. Clone this repository using command `git clone https://github.com/piyushdahiya1218/pdf-extractor.git`
2. Open this project in VS Code.
3. Open terminal (make sure to `cd` into the project) and run command `npm install`.
4. After node_modules are installed, run `npm start` to start the server on localhost port **3000** by default. If you already have something else running on this port then either kill that process or change the port.
5. After server is started successfully, open this address `localhost:3000` in browser (change port number if running on some other port).
6. By default the backend runs on port **5000**. If you changed this port number to something else, then please go to *utils* folder and open *constants.js* file and change the constant `BACKEND_SERVER_PORT_ADDRESS` accordingly.
