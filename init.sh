#!/usr/bin/env bash

# repositories
organizations=(cjs spa stb)
cjs=(async emitter format model parse-query parse-uri wamp)
spa=(app boilerplate develop dom gettext gulp keys request router)
stb=(app boilerplate develop gulp keys shim-classlist shim-bind shim-frame referrer)

for organization in ${organizations[@]}; do
    echo -e "\e[1m\e[32m[$organization]\e[0m"
    repos=$organization[@]

    # prepare
    mkdir $organization && cd $organization &&

    # get all organization repositories
    for name in ${!repos}; do
        git clone "git@github.com:${organization}sdk/$name.git"
        echo
    done &&

    cd ..
done
