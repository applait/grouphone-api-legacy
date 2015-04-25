# Grouphone API

API layer for Grouphone

## Install

- Give write permissions to the `storage` directory.
- Copy `config.js.sample` to `config.js` in the same directory.
- Change values in `config.js` if necessary.
- `npm install`
- `npm run cert`
- `node server.js`

## Run on different port

The port to run the server can be overriden by passing the port number
as third argument to `node server.js`. E.g. to run on port `80`, you
would do this:

```
# node server.js 80
```
