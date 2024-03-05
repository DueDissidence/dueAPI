#! /bin/bash

# Setup devcerts to allow for HTTPS ( This doesn't seem to be working )
mkdir -p devcerts
cd devcerts
mkcert -install
mkcert -cert-file cert.pem -key-file key.pem localhost tf.localhost api.localhost

cd ..
docker compose up --build -d
