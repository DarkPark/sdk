#!/usr/bin/env bash

# repositories
organizations=(cjs spa stb)
cjs=(async emitter format model parse-query parse-uri wamp)
spa=(app develop gettext gulp keys router)
stb=(app develop gulp keys shim-classlist shim-bind shim-frame referrer)

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

# prepare
#mkdir cjs && cd cjs &&
## get all repositories
#for name in ${cjs}; do
#    git clone "git@github.com:cjssdk/$name.git"
#done
#
## prepare
#mkdir spa && cd spa &&
## get all repositories
#for name in ${spa}; do
#    git clone "git@github.com:spasdk/$name.git"
#done
#
## prepare
#mkdir stb && cd stb &&
## get all repositories
#for name in ${stb}; do
#    git clone "git@github.com:stbsdk/$name.git"
#done
