#!/usr/bin/env bash

# lists of names
# to build project names

organizations=(
    cjs
    spa
    stb
)

cjs=(
    async emitter format model parse-query parse-uri runner wamp
    eslint-config
)

spa=(
    app boilerplate develop dom gettext preloader request
    eslint-config
    component
        component-button
        component-checkbox
        component-grid
        component-list
        component-page
        component-panel
    spasdk
        plugin
        plugin-css
        plugin-eslint
        plugin-gettext
        plugin-jade
        plugin-livereload
        plugin-sass
        plugin-static
        plugin-wamp
        plugin-webpack
        webui
        plugin-zip
)

stb=(
    app boilerplate develop referrer rc
    eslint-config
    component
        component-button
        component-checkbox
        component-grid
        component-list
        component-page
        component-panel
    shim-classlist
    shim-bind
    shim-frame
    stbsdk
        plugin-css
        plugin-proxy
        plugin-sass
        plugin-ssh
        plugin-webpack
        plugin-weinre
)

COLOR_RED='\e[0;31m'
COLOR_RESET='\e[0m'


# actions for projects

case "$1" in

    lint)
        for organization in ${organizations[@]}; do
            echo -e "\e[1m\e[32m[$organization]\e[0m"
            repos=$organization[@]

            # prepare
            cd $organization &&

            # iterate all packages
            for name in ${!repos}; do
                cd $name && echo $name
                eslint ./*.js ./lib/*.js
                cd ..
            done &&

            cd ..
        done
        ;;

    link)
        for organization in ${organizations[@]}; do
            echo -e "\e[1m\e[32m[$organization]\e[0m"
            repos=$organization[@]

            # iterate all packages
            for name in ${!repos}; do
                source=`realpath "${organization}/${name}"`
                target="/usr/lib/node_modules/`node -e "console.log(require('${source}/package.json').name);"`"

                if [ -L "$target" ]; then
                    echo -e "!$target ${COLOR_RED}already exists${COLOR_RESET}"
                else
                    ln -s $source $target && echo "+$target -> $source"
                fi
            done
        done
        ;;

    unlink)
        for organization in ${organizations[@]}; do
            echo -e "\e[1m\e[32m[$organization]\e[0m"
            repos=$organization[@]

            # iterate all packages
            for name in ${!repos}; do
                source=`realpath "${organization}/${name}"`
                target="/usr/lib/node_modules/`node -e "console.log(require('${source}/package.json').name);"`"

                if [ -L "$target" ]; then
                    rm $target && echo "-$target"
                else
                    echo -e "!$target ${COLOR_RED}does not exist${COLOR_RESET}"
                fi
            done
        done
        ;;

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

    clean)
        source="$(realpath .)"
        for organization in ${organizations[@]}; do
            echo -e "\e[1m\e[32m[$organization]\e[0m"
            repos=$organization[@]

            # iterate all packages
            for name in ${!repos}; do
                target="$source/$organization/$name/node_modules"

                if [ -d ${target} ]; then
                    rm -rf $target && echo -$target
                fi
            done &&

            cd ..
        done
        ;;

    pull)
        # meta-repo
        git pull &
        # sub-repositories
        for organization in ${organizations[@]}; do
            repos=$organization[@]

            cd $organization &&

            # update all organization repositories
            for name in ${!repos}; do
                cd $name && git pull &
            done &&

            cd ..
        done
        wait
        ;;

    push)
        # meta-repo
        git push &
        # sub-repositories
        for organization in ${organizations[@]}; do
            repos=$organization[@]

            cd $organization &&

            # update all organization repositories
            for name in ${!repos}; do
                cd $name && git push &
            done &&

            cd ..
        done
        wait
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

                    # additional dirs
                    mount --bind "$source/spa/spasdk" "$target/spasdk" && echo "+spasdk"
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

                    # additional dirs
                    umount "$target/spasdk" && echo "+spasdk"
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

    install)
        (cd spa/boilerplate/        && npm install)
        (cd spa/webui/              && npm install)
        (cd spa/spasdk/             && npm install)
        (cd stb/app/                && npm install)
        (cd stb/boilerplate/        && npm install)
        (cd stb/component/          && npm install)
        (cd stb/component-button/   && npm install)
        (cd stb/component-checkbox/ && npm install)
        (cd stb/component-grid/     && npm install)
        (cd stb/component-list/     && npm install)
        (cd stb/component-page/     && npm install)
        (cd stb/component-panel/    && npm install)
        (cd stb/stbsdk/             && npm install)
        ;;

    update)
        (cd spa/boilerplate/        && npm update)
        (cd spa/webui/              && npm update)
        (cd spa/spasdk/             && npm update)
        (cd stb/app/                && npm update)
        (cd stb/boilerplate/        && npm update)
        (cd stb/component/          && npm update)
        (cd stb/component-button/   && npm update)
        (cd stb/component-checkbox/ && npm update)
        (cd stb/component-grid/     && npm update)
        (cd stb/component-list/     && npm update)
        (cd stb/component-page/     && npm update)
        (cd stb/component-panel/    && npm update)
        (cd stb/stbsdk/             && npm update)
        ;;

    outdated)
        (cd spa/boilerplate/        && npm outdated)
        (cd spa/webui/              && npm outdated)
        (cd spa/spasdk/             && npm outdated)
        (cd stb/app/                && npm outdated)
        (cd stb/boilerplate/        && npm outdated)
        (cd stb/component/          && npm outdated)
        (cd stb/component-button/   && npm outdated)
        (cd stb/component-checkbox/ && npm outdated)
        (cd stb/component-grid/     && npm outdated)
        (cd stb/component-list/     && npm outdated)
        (cd stb/component-page/     && npm outdated)
        (cd stb/component-panel/    && npm outdated)
        (cd stb/stbsdk/             && npm outdated)
        ;;

    mount)
        ./run.sh bind spa/boilerplate/
        ./run.sh bind spa/webui/
        ./run.sh bind spa/spasdk/
        ./run.sh bind stb/app/
        ./run.sh bind stb/boilerplate/
        ./run.sh bind stb/component/
        ./run.sh bind stb/component-button/
        ./run.sh bind stb/component-checkbox/
        ./run.sh bind stb/component-grid/
        ./run.sh bind stb/component-list/
        ./run.sh bind stb/component-page/
        ./run.sh bind stb/component-panel/
        ./run.sh bind stb/stbsdk/
        ./run.sh bind stb/stbsdk/node_modules/spasdk
        ;;

    umount)
        ./run.sh unbind spa/boilerplate/
        ./run.sh unbind spa/webui/
        ./run.sh unbind spa/spasdk/
        ./run.sh unbind stb/app/
        ./run.sh unbind stb/boilerplate/
        ./run.sh unbind stb/component/
        ./run.sh unbind stb/component-button/
        ./run.sh unbind stb/component-checkbox/
        ./run.sh unbind stb/component-grid/
        ./run.sh unbind stb/component-list/
        ./run.sh unbind stb/component-page/
        ./run.sh unbind stb/component-panel/
        ./run.sh unbind stb/stbsdk/
        ./run.sh unbind stb/stbsdk/node_modules/spasdk
        ;;

    sass)
        (
            cd spa
            # build
            (cd app && npm run-script sass)
            (cd component && npm run-script sass)
            (cd component-button && npm run-script sass)
            (cd component-checkbox && npm run-script sass)
            (cd component-grid && npm run-script sass)
            (cd component-list && npm run-script sass)
            (cd component-page && npm run-script sass)
            (cd component-panel && npm run-script sass)
        )
        (
            cd stb
            # build
            (cd app && npm run-script sass)
            (cd component && npm run-script sass)
            (cd component-button && npm run-script sass)
            (cd component-checkbox && npm run-script sass)
            (cd component-grid && npm run-script sass)
            (cd component-list && npm run-script sass)
            (cd component-page && npm run-script sass)
            (cd component-panel && npm run-script sass)
        )
        ;;

    *)
        echo "available commands: clone, pull, push, version, publish, bind, unbind"
        ;;

esac
