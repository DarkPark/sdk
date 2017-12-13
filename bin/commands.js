/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs       = require('fs'),
    path     = require('path'),
    //exec     = require('child_process').execFile,
    exec     = require('child_process').execFileSync,
    packages = [],
    repos    = require('../repos'),
    sdkPath  = path.dirname(__dirname),
    cwdPath  = process.cwd();


// public
module.exports = {
    clone: function () {
        Object.keys(repos).forEach(function ( orgName ) {
            var debug = require('debug')(orgName);

            Object.keys(repos[orgName]).forEach(function ( repoName ) {
                var target  = path.join(sdkPath, orgName, repoName),
                    command = [
                        'clone',
                        '--progress',
                        repos[orgName][repoName].url,
                        target
                    ];

                debug('[%s] git %s', repoName, command.join(' '));

                if ( fs.existsSync(target) ) {
                    debug('[%s] already cloned', repoName);
                } else {
                    exec('git', command);
                }
            });
        });
    },

    status: function () {
        Object.keys(repos).forEach(function ( orgName ) {
            var debug = require('debug')(orgName);

            Object.keys(repos[orgName]).forEach(function ( repoName ) {
                var target  = path.join(sdkPath, orgName, repoName),
                    command = [
                        'status',
                        '--short'
                    ],
                    result;

                debug('[%s] git %s', repoName, command.join(' '));

                if ( fs.existsSync(target) ) {
                    result = exec('git', command, {cwd: path.join(sdkPath, orgName, repoName)}).toString();
                    if ( result ) {
                        console.log(target);
                        console.log(result);
                    }
                } else {
                    debug('[%s] not cloned', repoName);
                }
            });
        });
    },

    pull: function () {
        Object.keys(repos).forEach(function ( orgName ) {
            var debug = require('debug')(orgName);

            Object.keys(repos[orgName]).forEach(function ( repoName ) {
                var target  = path.join(sdkPath, orgName, repoName),
                    command = [
                        'pull',
                        '--progress'
                    ];

                debug('[%s] git %s', repoName, command.join(' '));

                if ( fs.existsSync(target) ) {
                    exec('git', command, {cwd: target});
                } else {
                    debug('[%s] not cloned', repoName);
                }
            });
        });
    },

    push: function () {
        Object.keys(repos).forEach(function ( orgName ) {
            var debug = require('debug')(orgName);

            Object.keys(repos[orgName]).forEach(function ( repoName ) {
                var target  = path.join(sdkPath, orgName, repoName),
                    command = [
                        'push',
                        '--quiet'
                    ];

                debug('[%s] git %s', repoName, command.join(' '));

                if ( fs.existsSync(target) ) {
                    exec('git', command, {cwd: target});
                } else {
                    debug('[%s] not cloned', repoName);
                }
            });
        });
    },

    link: function () {
        if ( fs.existsSync(path.join(cwdPath, 'package.json')) ) {
            fs.mkdir(path.join(cwdPath, 'node_modules'), function () {
                Object.keys(repos).forEach(function ( orgName ) {
                    var debug = require('debug')(orgName);

                    Object.keys(repos[orgName]).forEach(function ( repoName ) {
                        var pkgName = repos[orgName][repoName].name,
                            dstName = path.join(sdkPath, orgName, repoName),
                            srcName = path.join(cwdPath, 'node_modules', pkgName || '');

                        // apply only for existing repos
                        if ( fs.existsSync(dstName) ) {
                            if ( pkgName ) {
                                if ( fs.existsSync(srcName) ) {
                                    debug('[%s] already exist', repoName);
                                } else {
                                    fs.symlinkSync(dstName, srcName, 'dir');
                                    debug('[%s] %s -> %s', repoName, srcName, dstName);
                                }
                            }
                        } else {
                            console.log('missing repo - ' + dstName);
                        }
                    });
                });
            });
        } else {
            console.log('You should be in the root directory of your project!');
        }
    },

    unlink: function () {
        if ( fs.existsSync(path.join(cwdPath, 'package.json')) ) {
            Object.keys(repos).forEach(function ( orgName ) {
                var debug = require('debug')(orgName);

                Object.keys(repos[orgName]).forEach(function ( repoName ) {
                    var pkgName = repos[orgName][repoName].name,
                        srcName = path.join(cwdPath, 'node_modules', pkgName || '');

                    if ( pkgName && fs.existsSync(srcName) && fs.lstatSync(srcName).isSymbolicLink() ) {
                        fs.unlinkSync(srcName);
                        debug('[%s] deleted %s', repoName, srcName);
                    } else {
                        debug('[%s] wrong target', repoName);
                    }
                });
            });
        } else {
            console.log('You should be in the root directory of your project!');
        }
    },

    lint: function () {
        var env = Object.assign({}, process.env);

        delete env.DEBUG;

        Object.keys(repos).forEach(function ( orgName ) {
            var debug = require('debug')(orgName);

            Object.keys(repos[orgName]).forEach(function ( repoName ) {
                var pkgFile = path.join(sdkPath, orgName, repoName, 'package.json'),
                    pkgData, result;

                if ( fs.existsSync(pkgFile) ) {
                    // package.json content
                    pkgData = require(pkgFile);

                    if ( pkgData.scripts && pkgData.scripts.lint ) {
                        debug('[%s] %s', repoName, pkgData.scripts.lint);

                        try {
                            result = exec(
                                'npm', ['run', '--silent', 'lint'], {env: env, cwd: path.join(sdkPath, orgName, repoName)}
                            ).toString().trim();
                            result && console.log(result);
                        } catch ( error ) {
                            console.log(error.stdout.toString());
                        }
                    } else {
                        debug('[%s] lint script was not found', repoName);
                    }
                } else {
                    console.log('missing file %s', pkgFile);
                }
            });
        });
    }
};
