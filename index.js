/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

/* eslint quote-props: off */

'use strict';

var fs       = require('fs'),
    path     = require('path'),
    //util     = require('util'),
    exec     = require('child_process').execFile,
    execSync = require('child_process').execFileSync,
    methods  = {},
    packages = [],
    repos    = require('./repos'),
    root = process.cwd()/*,
    home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'],
    libs = path.join(home, '.node_libraries')*/;


// function isGlobalPackage ( name ) {
//     try {
//         if ( require.resolve(name) ) {
//             //console.log(name + ' found');
//             return true;
//         }
//     } catch ( e ) {
//         //console.log(name + ' not found!');
//         return false;
//     }
// }


function getDependencies ( pkgFile ) {
    var info = require(pkgFile),
        list = [];

    Object.keys(info.dependencies || {}).forEach(function ( depName ) {
        //if ( !isGlobalPackage(depName) ) {
        if ( packages.indexOf(depName) === -1 ) {
            list.push(depName + '@' + info.dependencies[depName]);
        }
    });

    Object.keys(info.devDependencies || {}).forEach(function ( depName ) {
        if ( packages.indexOf(depName) === -1 ) {
            list.push(depName + '@' + info.devDependencies[depName]);
        }
    });

    return list;
}


Object.keys(repos).forEach(function ( orgName ) {
    Object.keys(repos[orgName]).forEach(function ( repoName ) {
        var name = repos[orgName][repoName];

        name && packages.push(name);
    });
});/**/


methods.clone = function () {
    var tasks  = [],
        serial = require('cjs-async/serial');

    Object.keys(repos).forEach(function ( orgName ) {
        var orgPath = path.join(root, orgName);

        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            if ( !fs.existsSync(path.join(orgPath, repoName)) ) {
                tasks.push(function ( callback ) {
                    exec('git', [
                        'clone',
                        '--progress',
                        repos[orgName][repoName].url,
                        path.join(orgName, repoName)
                    ], function ( error, stdout, stderr ) {
                        console.log('\u001b[32m' + orgName + '/' + repoName + '\u001b[0m');

                        if ( error ) {
                            console.error(error.message);
                            process.exitCode = 1;
                        } else {
                            stderr && console.log(stderr);
                            stdout && console.log(stdout);
                        }
                        callback();
                    });
                });
            }
        });
    });

    // run
    serial(tasks, function ( error ) {
        if ( error ) {
            console.log(error);
        }
    });
};


methods.pull = function () {
    var tasks  = [],
        serial = require('cjs-async/serial');

    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            // apply only for existing repos
            if ( fs.existsSync(path.join(root, orgName, repoName)) ) {
                tasks.push(function ( callback ) {
                    exec('git', [
                        'pull',
                        '--progress'
                    ], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                        console.log('\u001b[32m' + orgName + '/' + repoName + '\u001b[0m');

                        if ( error ) {
                            console.error(error);
                            process.exitCode = 1;
                        } else {
                            stderr && console.log(stderr);
                            stdout && console.log(stdout);
                        }
                        callback();
                    });
                });
            }
        });
    });

    // run
    serial(tasks, function ( error ) {
        if ( error ) {
            console.log(error);
        }
    });
};


methods.push = function () {
    var tasks  = [],
        serial = require('cjs-async/serial');

    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            // apply only for existing repos
            if ( fs.existsSync(path.join(root, orgName, repoName)) ) {
                tasks.push(function ( callback ) {
                    exec('git', [
                        'push',
                        '--progress'
                    ], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                        console.log('\u001b[32m' + orgName + '/' + repoName + '\u001b[0m');

                        if ( error ) {
                            console.error(error);
                            process.exitCode = 1;
                        } else {
                            stderr && console.log(stderr);
                            stdout && console.log(stdout);
                        }
                        callback();
                    });
                });
            }
        });
    });

    // run
    serial(tasks, function ( error ) {
        if ( error ) {
            console.log(error);
        }
    });
};


methods.install = function () {
    /*Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            var list = getDependencies(path.join(root, orgName, repoName, 'package.json'));

            //console.log(list);
            //return;

            if ( list.length ) {
                exec('npm', ['install'].concat(list), {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                    if ( error ) {
                        console.error(error);
                        process.exitCode = 1;
                    } else {
                        stderr && console.log(stderr);
                        stdout && console.log(stdout);
                    }
                });
            }
        });
    });*/

    var list = [];
        //dest = path.join(home, '.node_modules');

    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            list = list.concat(getDependencies(path.join(root, orgName, repoName, 'package.json')));
        });
    });

    list = list.reduce(function ( a, b ) {
        if ( a.indexOf(b) < 0 ) {
            a.push(b);
        }

        return a;
    }, []).sort();

    //fs.mkdir(dest, function () {
    exec('npm', ['install'].concat(list), function ( error, stdout, stderr ) {
        if ( error ) {
            console.error(error);
            process.exitCode = 1;
        } else {
            stderr && console.log(stderr);
            stdout && console.log(stdout);
        }
    });/**/
    //});

    console.log(list);/**/
};


methods.outdated = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            exec('npm', ['outdated', '--parseable'], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                console.log('\u001b[32m' + orgName + '/' + repoName + '\u001b[0m');

                if ( error ) {
                    console.error(error);
                    process.exitCode = 1;
                } else {
                    //stderr && console.log(stderr);
                    //stdout && console.log(stdout);
                    stdout.split('\n').forEach(function ( line ) {
                        if ( line.indexOf('MISSING') === -1 ) {
                            console.log(line);
                        }
                    });
                }
            });
        });
    });
};


methods.reset = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            var dir = path.join(root, orgName, repoName, './node_modules');

            if ( fs.existsSync(dir) ) {
                console.log('-' + dir);
                exec('rm', ['-rf', dir], function ( error, stdout, stderr ) {
                    if ( error ) {
                        console.error(error);
                        process.exitCode = 1;
                    } else {
                        stderr && console.log(stderr);
                        stdout && console.log(stdout);
                    }
                });
            }
        });
    });
};


/*methods.update = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            var list = getDependencies(path.join(root, orgName, repoName, 'package.json'));

            if ( list.length ) {
                exec('npm', ['update'].concat(list), {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                    if ( error ) {
                        console.error(error);
                        process.exitCode = 1;
                    } else {
                        stderr && console.log(stderr);
                        stdout && console.log(stdout);
                    }
                });
            }
        });
    });
};*/


methods.link = function () {
    /*fs.mkdir(libs, function () {
        Object.keys(repos).forEach(function ( orgName ) {
            Object.keys(repos[orgName]).forEach(function ( repoName ) {
                var pkgName = repos[orgName][repoName],
                    dstName = path.join(root, orgName, repoName),
                    srcName = path.join(libs, pkgName || '');

                if ( pkgName && !fs.existsSync(srcName) ) {
                    fs.symlinkSync(dstName, srcName, 'dir');
                    console.log('+' + srcName + ' -> ' + dstName);
                }
            });
        });
    });*/

    fs.mkdir(path.join(root, 'node_modules'), function () {
        Object.keys(repos).forEach(function ( orgName ) {
            Object.keys(repos[orgName]).forEach(function ( repoName ) {
                var pkgName = repos[orgName][repoName].name,
                    dstName = path.join(__dirname, orgName, repoName),
                    srcName = path.join(root, 'node_modules', pkgName || '');

                // apply only for existing repos
                if ( fs.existsSync(dstName) ) {
                    if ( pkgName && !fs.existsSync(srcName) ) {
                        fs.symlinkSync(dstName, srcName, 'dir');
                        console.log('+' + srcName + ' -> ' + dstName);
                    }
                } else {
                    console.log('!' + dstName + ' (missing repo)');
                }
            });
        });
    });
};


methods.unlink = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            var pkgName = repos[orgName][repoName].name,
                srcName = path.join(root, 'node_modules', pkgName || '');

            if ( pkgName && fs.existsSync(srcName) ) {
                fs.unlinkSync(srcName);
                console.log('-' + srcName);
            }
        });
    });
};


methods.sass = function () {
    var tasks  = [],
        serial = require('cjs-async/serial');

    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            var info = require(path.join(root, orgName, repoName, 'package.json'));

            if ( info.scripts && info.scripts.sass ) {
                tasks.push(function ( callback ) {
                    exec('npm', ['run-script', 'sass'], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                        if ( error ) {
                            console.error(error);
                            process.exitCode = 1;
                        } else {
                            stderr && console.log(stderr);
                            stdout && console.log(stdout);
                        }
                        callback();
                    });
                });
            }

        });
    });

    // run
    serial(tasks, function ( error ) {
        if ( error ) {
            console.log(error);
        }
    });
};


methods.check = function () {
    var tasks  = [],
        serial = require('cjs-async/serial');

    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            // only packages
            if ( repos[orgName][repoName].name ) {
                tasks.push(function ( callback ) {
                    var info = require(path.join(root, orgName, repoName, 'package.json')),
                        gitRevision, npmRevision;

                    exec('git', ['rev-parse', 'HEAD'], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                        if ( error ) {
                            console.error(error);
                            process.exitCode = 1;
                        } else {
                            //console.log(info.name);
                            gitRevision = stdout.trim();

                            exec('npm', ['--registry', 'http://npm.lpo.priv:4873', 'info', info.name, 'gitHead'], function ( error, stdout, stderr ) {
                                if ( error ) {
                                    console.error(error);
                                    process.exitCode = 1;
                                } else {
                                    //stderr && console.log(stderr);
                                    //console.log(stdout + '\n');
                                    npmRevision = stdout.trim();

                                    if ( gitRevision === npmRevision ) {
                                        console.log('\u001b[32mup-to-date\u001b[0m\t%s\t%s\t%s\t%s',
                                            npmRevision, gitRevision, info.version, info.name);
                                    } else {
                                        console.log('\u001b[31mout-of-date\u001b[0m\t%s\t%s\t%s\t%s',
                                            npmRevision, gitRevision, info.version, info.name);
                                    }
                                }
                                callback();
                            });
                        }
                    });
                });
            }
        });
    });

    // run
    serial(tasks, function ( error ) {
        if ( error ) {
            console.log(error);
        }
    });
};


methods.lint = function () {
    var tasks  = [],
        serial = require('cjs-async/serial');

    // prepare
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            var uri  = path.join(root, orgName, repoName, 'package.json'),
                info, cmd;

            if ( fs.existsSync(uri) ) {
                // package.json content
                info = require(uri);

                if ( info.scripts && info.scripts.lint ) {
                    tasks.push(function ( callback ) {
                        cmd = info.scripts.lint.split(' ');

                        exec(cmd.shift(), cmd, {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                        //exec('npm', ['run-script', 'lint'], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                        //exec(info.scripts.lint, {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
                            //console.log(error);
                            console.log('\u001b[32m' + orgName + '/' + repoName + '\u001b[0m');
                            console.log('\u001b[31m' + stdout.trim() + '\u001b[0m\n');
                            //console.log(stderr);
                            /*console.log('\u001b[32m' + orgName + '/' + repoName + '\u001b[0m');
                            //console.log(cmd);
                            //console.log(path.join(root, orgName, repoName));

                            if ( error ) {
                                console.error(error);
                                process.exitCode = 1;
                            } else {
                                stderr && console.log(stderr);
                                stdout && console.log(stdout);
                            }*/

                            callback();
                        });
                    });
                }
            }
        });
    });

    // run
    serial(tasks, function ( error ) {
        if ( error ) {
            console.log(error);
        }
    });
};


// exec given command
if ( methods[process.argv[2]] ) {
    methods[process.argv[2]]();
} else {
    console.log('Available commands:', Object.keys(methods).join(', '));
}
