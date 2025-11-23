#!/bin/sh

export MYSQL_PASSWORD="$(cat /run/secrets/MY_CHANNEL_MYSQL_PASSWORD)"
export API_KEY="$(cat /run/secrets/MY_CHANNEL_API_KEY)"
export MJ_APIKEY_PUBLIC="$(cat /run/secrets/MY_CHANNEL_MJ_APIKEY_PUBLIC)"
export MJ_APIKEY_PRIVATE="$(cat /run/secrets/MY_CHANNEL_MJ_APIKEY_PRIVATE)"

exec "$@"
