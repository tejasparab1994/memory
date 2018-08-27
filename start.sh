#!/bin/bash

export PORT=5102

cd ~/www/memory
./bin/memory stop || true
./bin/memory start

