/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs      = require('fs'),
    path    = require('path'),
    util    = require('util'),
    exec    = require('child_process').execFile,
    methods = {},
    repos   = {
        cjssdk: {
            'async': 'cjs-async',
            'emitter': 'cjs-emitter',
            'format': 'cjs-format',
            'model': 'cjs-model',
            'parse-query': 'cjs-parse-query',
            'parse-uri': 'cjs-parse-uri',
            'runner': 'cjs-runner',
            'wamp': 'cjs-wamp',
            'eslint-config': 'cjs-eslint-config'
        },
        spasdk: {
            'app': 'spa-app',
            'boilerplate': 'spa-boilerplate',
            'develop': 'spa-develop',
            'dom': 'spa-dom',
            'gettext': 'spa-gettext',
            'preloader': 'spa-preloader',
            'request': 'spa-request',
            'eslint-config': 'spa-eslint-config',
            'component': 'spa-component',
            'component-button': 'spa-component-button',
            'component-checkbox': 'spa-component-checkbox',
            'component-grid': 'spa-component-grid',
            'component-list': 'spa-component-list',
            'component-page': 'spa-component-page',
            'component-panel': 'spa-component-panel',
            'spasdk': 'spasdk',
            'plugin': 'spa-plugin',
            'plugin-css': 'spa-plugin-css',
            'plugin-eslint': 'spa-plugin-eslint',
            'plugin-gettext': 'spa-plugin-gettext',
            'plugin-jade': 'spa-plugin-jade',
            'plugin-livereload': 'spa-plugin-livereload',
            'plugin-sass': 'spa-plugin-sass',
            'plugin-static': 'spa-plugin-static',
            'plugin-wamp': 'spa-plugin-wamp',
            'plugin-webpack': 'spa-plugin-webpack',
            'plugin-webui': 'spa-plugin-webui',
            'plugin-zip': 'spa-plugin-zip'
        },
        stbsdk: {
            'app': 'stb-app',
            'boilerplate': 'stb-boilerplate',
            'develop': 'stb-develop',
            'referrer': 'stb-referrer',
            'rc': 'stb-rc',
            'eslint-config': 'stb-eslint-config',
            'component': 'stb-component',
            'component-button': 'stb-component-button',
            'component-checkbox': 'stb-component-checkbox',
            'component-grid': 'stb-component-grid',
            'component-list': 'stb-component-list',
            'component-page': 'stb-component-page',
            'component-panel': 'stb-component-panel',
            'shim-classlist': 'stb-shim-classlist',
            'shim-bind': 'stb-shim-bind',
            'shim-frame': 'stb-shim-frame',
            'stbsdk': 'stbsdk',
            'plugin-css': 'stb-plugin-css',
            'plugin-proxy': 'stb-plugin-proxy',
            'plugin-sass': 'stb-plugin-sass',
            'plugin-ssh': 'stb-plugin-ssh',
            'plugin-webpack': 'stb-plugin-webpack',
            'plugin-weinre': 'stb-plugin-weinre'
        }
    },
    root = process.cwd();


methods.clone = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        var orgPath = path.join(root, orgName);

        fs.mkdir(orgPath, function () {
            Object.keys(repos[orgName]).forEach(function ( repoName ) {
                if ( !fs.existsSync(path.join(orgPath, repoName)) ) {
                    exec('git', ['clone', '--progress', util.format('git@github.com:%s/%s.git', orgName, repoName)], {cwd: orgPath}, function ( error, stdout, stderr ) {
                        console.log(orgName + '/' + repoName);

                        if ( error ) {
                            console.error(error.message);
                            process.exitCode = 1;
                        } else {
                            console.log(stderr);
                            console.log(stdout);
                        }
                    });
                }
            });
        });
    });
};


methods.pull = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            exec('git', ['pull', '--progress'], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                console.log('\u001b[32m' + orgName + '/' + repoName + '\u001b[0m');

                if ( error ) {
                    console.error(error);
                    process.exitCode = 1;
                } else {
                    console.log(stdout);
                    console.log(stderr);
                }
            });
        });
    });
};


methods.push = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            exec('git', ['push', '--progress'], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                console.log('\u001b[32m' + orgName + '/' + repoName + '\u001b[0m');

                if ( error ) {
                    console.error(error);
                    process.exitCode = 1;
                } else {
                    console.log(stderr);
                    console.log(stdout);
                }
            });
        });
    });
};


// exec given command
if ( methods[process.argv[2]] ) {
    methods[process.argv[2]]();
}
