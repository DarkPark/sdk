#!/usr/bin/env bash

# repositories
organizations=(cjs spa stb)
cjs=(async emitter format model parse-query parse-uri wamp)
spa=(app boilerplate component component-page develop dom gettext gulp gulp-jade gulp-sass keys preloader request router)
stb=(app boilerplate develop gulp keys shim-classlist shim-bind shim-frame referrer)

case "$1" in

    clone)
        for organization in ${organizations[@]}; do
            echo -e "\e[1m\e[32m[$organization]\e[0m"
            repos=$organization[@]

            # prepare
            mkdir -p $organization && cd $organization &&

            # iterate all packages
            for name in ${!repos}; do
                if [ -d "$name" ]; then
                    echo $name is already exist
                else
                    git clone "git@github.com:${organization}sdk/$name.git"
                    echo
                fi
            done &&

            cd ..
        done
        ;;

    pull)
        for organization in ${organizations[@]}; do
            echo -e "\e[1m\e[32m[$organization]\e[0m"
            repos=$organization[@]

            cd $organization &&

            # update all organization repositories
            for name in ${!repos}; do
                cd $name && echo $name && git pull && echo && cd ..
            done &&

            cd ..
        done
        ;;

    push)
        for organization in ${organizations[@]}; do
            echo -e "\e[1m\e[32m[$organization]\e[0m"
            repos=$organization[@]

            cd $organization &&

            # update all organization repositories
            for name in ${!repos}; do
                cd $name && echo $name && git push && echo && cd ..
            done &&

            cd ..
        done
        ;;

    version)
        for organization in ${organizations[@]}; do
            repos=$organization[@]

            # get all packages info
            for name in ${!repos}; do
                version=$(npm info "$organization-$name" version 2> /dev/null)

                if [ $version ]; then
                    echo -e "$version\t\e[0m\e[32m$organization-$name\e[0m"
                else
                    echo -e "(n/a)\t\e[0m\e[33m$organization-$name\e[0m"
                fi
            done
        done
        ;;

    publish)
        for organization in ${organizations[@]}; do
            repos=$organization[@]

            # prepare
            cd $organization &&

            # iterate all packages
            for name in ${!repos}; do
                # package to be published
                if [ -f "$name/.npmignore" ]; then
                    old=$(npm info "$organization-$name" version 2> /dev/null)
                    npm publish $name &> /dev/null || rm npm-debug.log
                    new=$(npm info "$organization-$name" version 2> /dev/null)

                    if [ "$old" == "$new" ]; then
                        echo -e "$old\t$new\t\e[1m\e[30m$organization-$name\e[0m"
                    else
                        echo -e "$old\t$new\t\e[0m\e[32m$organization-$name\e[0m"
                    fi
                else
                    echo -e "(n/a)\t(n/a)\t\e[0m\e[33m$organization-$name\e[0m"
                fi
            done &&

            cd ..
        done
        ;;

    bind)
        # check if root
        if [ $UID -eq 0 ]; then
            # check if target dir is given
            if [ -d "$2" ]; then
                source="$(realpath .)"
                target="$(realpath "$2")/node_modules"

                if [ -d "$target" ]; then
                    for organization in ${organizations[@]}; do
                        repos=$organization[@]

                        # iterate all packages
                        for name in ${!repos}; do
                            if [ -d "$target/$organization-$name" ]; then
                                # check if already mounted
                                if mountpoint -q "$target/$organization-$name"; then
                                    echo -e "skip \e[0m\e[33m$organization-$name\e[0m (already mounted)"
                                else
                                    mount --bind "$source/$organization/$name" "$target/$organization-$name"
                                    echo -e "bind \e[0m\e[32m$organization-$name\e[0m"
                                fi
                            fi
                        done
                    done
                else
                    echo "missing node_modules directory"
                fi
            else
                echo "invalid target directory (should be root of the project)"
            fi
        else
            echo "should be run with sudo"
        fi
        ;;

    unbind)
        # check if root
        if [ $UID -eq 0 ]; then
            # check if target dir is given
            if [ -d "$2" ]; then
                source="$(realpath .)"
                target="$(realpath "$2")/node_modules"

                if [ -d "$target" ]; then
                    for organization in ${organizations[@]}; do
                        repos=$organization[@]

                        # iterate all packages
                        for name in ${!repos}; do
                            if [ -d "$target/$organization-$name" ]; then
                                # check if already mounted
                                if mountpoint -q "$target/$organization-$name"; then
                                    umount "$target/$organization-$name"
                                    echo -e "free \e[0m\e[32m$organization-$name\e[0m"
                                else
                                    echo -e "skip \e[0m\e[33m$organization-$name\e[0m (not mounted)"
                                fi
                            fi
                        done
                    done
                else
                    echo "missing node_modules directory"
                fi
            else
                echo "invalid target directory (should be root of the project)"
            fi
        else
            echo "should be run with sudo"
        fi
        ;;

    *)
        echo "available commands: clone, pull, push, version, publish, bind, unbind"
        ;;

esac
