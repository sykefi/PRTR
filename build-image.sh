#!/bin/bash
set -ex

USER='prtrdev.azurecr.io'
DOCKER_IMAGE=${USER}/fin-prtr

docker build -t ${DOCKER_IMAGE}:latest .

docker login prtrdev.azurecr.io
docker push prtrdev.azurecr.io/fin-prtr:latest
