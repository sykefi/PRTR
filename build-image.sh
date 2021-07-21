#!/bin/bash
set -ex

USER='hellej'
DOCKER_IMAGE=${USER}/fin-prtr

docker build -t ${DOCKER_IMAGE}:latest .

docker push ${DOCKER_IMAGE}:latest
