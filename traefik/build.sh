#! /bin/bash

if test -f acme.json; then
  rm acme.json
fi
touch acme.json
chmod 600 acme.json
