#!/bin/bash

set -e;

echo "Creating self-signed certificate";
mkdir -p infosec;
openssl req -x509 -newkey rsa:2048 -keyout infosec/key.pem -out infosec/cert.pem -days 365;

echo "Done";
