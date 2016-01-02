#!/usr/bin/env bash

# repositories
organizations=(cjs spa stb)
cjs=(async emitter format model parse-query parse-uri wamp)
spa=(app develop dom gettext gulp keys request router)
stb=(app develop gulp keys shim-classlist shim-bind shim-frame referrer)

for organization in ${organizations[@]}; do
    echo -e "\e[1m\e[32m[$organization]\e[0m"
    repos=$organization[@]

    # prepare
    cd $organization &&

    # get all organization repositories
    for name in ${!repos}; do
        npm publish $name 2> /dev/null || (echo "  $name skipped" && rm npm-debug.log)
    done &&

    cd ..
done
