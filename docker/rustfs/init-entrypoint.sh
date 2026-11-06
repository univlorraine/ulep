#!/bin/sh
set -e

/entrypoint.sh "$@" &
RUSTFS_PID=$!

trap 'kill -TERM "$RUSTFS_PID" 2>/dev/null; wait "$RUSTFS_PID"; exit $?' TERM INT

until curl -sf http://localhost:9000/health > /dev/null; do
  if ! kill -0 "$RUSTFS_PID" 2>/dev/null; then
    wait "$RUSTFS_PID"
    exit $?
  fi
  sleep 1
done

export RC_CONFIG_DIR=/tmp/rc
rc alias set local http://localhost:9000 "$RUSTFS_ACCESS_KEY" "$RUSTFS_SECRET_KEY"

for bucket in $PUBLIC_BUCKETS; do
  rc mb --ignore-existing "local/$bucket"
  rc anonymous set download "local/$bucket"
done

for bucket in $PRIVATE_BUCKETS; do
  rc mb --ignore-existing "local/$bucket"
  rc anonymous set private "local/$bucket"
done

wait "$RUSTFS_PID"
