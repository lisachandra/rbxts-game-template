#!/bin/sh

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <rojo-project> <place-output>" >&2
  exit 1
fi

mkdir -p "$(dirname "$2")"
rojo build "$1" --output "$2"
