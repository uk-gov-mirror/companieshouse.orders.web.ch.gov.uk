#!/usr/bin/env node

/**
 * Module dependencies.
 */

import * as http from "http";
import * as yargs from "yargs";
import app from "../app";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(yargs.argv.PORT || yargs.argv._[0]);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
    const portInt = parseInt(val, 10);

    if (isNaN(portInt)) {
        // named pipe
        return val;
    }

    if (portInt >= 0) {
        // port number
        return portInt;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
    case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr!.port;
    console.info("Listening on " + bind);
}
