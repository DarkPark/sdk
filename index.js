/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs       = require('fs'),
    path     = require('path'),
    util     = require('util'),
//    util     = require('cjs-async'),
    exec     = require('child_process').execFile,
    methods  = {},
    packages = [],
    repos    = {
        cjssdk: {
            'async':            {name: 'cjs-async', url: 'git@github.com:cjssdk/async.git'},
            'emitter':          {name: 'cjs-emitter', url: 'git@github.com:cjssdk/emitter.git'},
            'eslint-config':    {name: 'cjs-eslint-config', url: 'git@github.com:cjssdk/eslint-config.git'},
            'format':           {name: 'cjs-format', url: 'git@github.com:cjssdk/format.git'},
            'iso-639':          {name: 'cjs-iso-639', url: 'git@github.com:cjssdk/iso-639.git'},
            'model':            {name: 'cjs-model', url: 'git@github.com:cjssdk/model.git'},
            'property-watcher': {name: 'cjs-property-watcher', url: 'git@github.com:cjssdk/property-watcher.git'},
            'query':            {name: 'cjs-query', url: 'git@github.com:cjssdk/query.git'},
            'runner':           {name: 'cjs-runner', url: 'git@github.com:cjssdk/runner.git'},
            'uri':              {name: 'cjs-uri', url: 'git@github.com:cjssdk/uri.git'},
            'wamp':             {name: 'cjs-wamp', url: 'git@github.com:cjssdk/wamp.git'}
        },
        magsdk: {
            'apps-base':             {name: 'mag-apps-base', url: 'git@github.com:magsdk/apps-base.git'},
            'apps-extra':            {name: 'mag-apps-extra', url: 'git@github.com:magsdk/apps-extra.git'},
            'eslint-config':         {name: 'mag-eslint-config', url: 'git@github.com:magsdk/eslint-config.git'},
            'component-footer':      {name: 'mag-component-footer', url: 'git@192.168.1.222:/web/magsdk/component-footer.git'},
            'component-radio-list':  {name: 'mag-component-radio-list', url: 'git@192.168.1.222:/web/magsdk/component-radio-list.git'},
            'component-layout-list': {name: 'mag-component-layout-list', url: 'git@192.168.1.222:/web/magsdk/component-layout-list.git'},
            'component-panel':       {name: 'mag-component-panel', url: 'git@192.168.1.222:/web/magsdk/component-panel.git'},
            'component-panel-set':   {name: 'mag-component-panel-set', url: 'git@192.168.1.222:/web/magsdk/component-panel-set.git'}
        },
        spasdk: {
            'app':                 {name: 'spa-app', url: 'git@github.com:spasdk/app.git'},
            'boilerplate':         {name: null, url: 'git@github.com:spasdk/boilerplate.git'},
            'dom':                 {name: 'spa-dom', url: 'git@github.com:spasdk/dom.git'},
            'gettext':             {name: 'spa-gettext', url: 'git@github.com:spasdk/gettext.git'},
            'preloader':           {name: 'spa-preloader', url: 'git@github.com:spasdk/preloader.git'},
            'request':             {name: 'spa-request', url: 'git@github.com:spasdk/request.git'},
            'eslint-config':       {name: 'spa-eslint-config', url: 'git@github.com:spasdk/eslint-config.git'},
            'component':           {name: 'spa-component', url: 'git@github.com:spasdk/component.git'},
            'component-button':    {name: 'spa-component-button', url: 'git@github.com:spasdk/component-button.git'},
            'component-checkbox':  {name: 'spa-component-checkbox', url: 'git@github.com:spasdk/component-checkbox.git'},
            'component-flicker':   {name: 'spa-component-flicker', url: 'git@github.com:spasdk/component-flicker.git'},
            'component-grid':      {name: 'spa-component-grid', url: 'git@github.com:spasdk/component-grid.git'},
            'component-list':      {name: 'spa-component-list', url: 'git@github.com:spasdk/component-list.git'},
            'component-input':     {name: 'spa-component-input', url: 'git@github.com:spasdk/component-input.git'},
            'component-page':      {name: 'spa-component-page', url: 'git@github.com:spasdk/component-page.git'},
            'component-panel':     {name: 'spa-component-panel', url: 'git@github.com:spasdk/component-panel.git'},
            'component-tab-item':  {name: 'spa-component-tab-item', url: 'git@github.com:spasdk/component-tab-item.git'},
            'component-scrollbar': {name: 'spa-component-scrollbar', url: 'git@github.com:spasdk/component-scrollbar.git'},
            'spasdk':              {name: 'spasdk', url: 'git@github.com:spasdk/spasdk.git'},
            'plugin':              {name: 'spa-plugin', url: 'git@github.com:spasdk/plugin.git'},
            'plugin-css':          {name: 'spa-plugin-css', url: 'git@github.com:spasdk/plugin-css.git'},
            'plugin-eslint':       {name: 'spa-plugin-eslint', url: 'git@github.com:spasdk/plugin-eslint.git'},
            'plugin-gettext':      {name: 'spa-plugin-gettext', url: 'git@github.com:spasdk/plugin-gettext.git'},
            'plugin-jade':         {name: 'spa-plugin-jade', url: 'git@github.com:spasdk/plugin-jade.git'},
            'plugin-livereload':   {name: 'spa-plugin-livereload', url: 'git@github.com:spasdk/plugin-livereload.git'},
            'plugin-sass':         {name: 'spa-plugin-sass', url: 'git@github.com:spasdk/plugin-sass.git'},
            'plugin-static':       {name: 'spa-plugin-static', url: 'git@github.com:spasdk/plugin-static.git'},
            'plugin-wamp':         {name: 'spa-plugin-wamp', url: 'git@github.com:spasdk/plugin-wamp.git'},
            'plugin-webpack':      {name: 'spa-plugin-webpack', url: 'git@github.com:spasdk/plugin-webpack.git'},
            'plugin-webui':        {name: 'spa-plugin-webui', url: 'git@github.com:spasdk/plugin-webui.git'},
            'plugin-zip':          {name: 'spa-plugin-zip', url: 'git@github.com:spasdk/plugin-zip.git'},
            'wamp':                {name: 'spa-wamp', url: 'git@github.com:spasdk/wamp.git'}
        },
        stbsdk: {
            'app':                 {name: 'stb-app', url: 'git@github.com:stbsdk/app.git'},
            'boilerplate':         {name: null, url: 'git@github.com:stbsdk/boilerplate.git'},
            'referrer':            {name: 'stb-referrer', url: 'git@github.com:stbsdk/referrer.git'},
            'rc':                  {name: 'stb-rc', url: 'git@github.com:stbsdk/rc.git'},
            'eslint-config':       {name: 'stb-eslint-config', url: 'git@github.com:stbsdk/eslint-config.git'},
            'component':           {name: 'stb-component', url: 'git@github.com:stbsdk/component.git'},
            'component-button':    {name: 'stb-component-button', url: 'git@github.com:stbsdk/component-button.git'},
            'component-checkbox':  {name: 'stb-component-checkbox', url: 'git@github.com:stbsdk/component-checkbox.git'},
            'component-grid':      {name: 'stb-component-grid', url: 'git@github.com:stbsdk/component-grid.git'},
            'component-input':     {name: 'stb-component-input', url: 'git@github.com:stbsdk/component-input.git'},
            'component-list':      {name: 'stb-component-list', url: 'git@github.com:stbsdk/component-list.git'},
            'component-page':      {name: 'stb-component-page', url: 'git@github.com:stbsdk/component-page.git'},
            'component-panel':     {name: 'stb-component-panel', url: 'git@github.com:stbsdk/component-panel.git'},
            'component-scrollbar': {name: 'stb-component-scrollbar', url: 'git@github.com:stbsdk/component-scrollbar.git'},
            'shim-classlist':      {name: 'stb-shim-classlist', url: 'git@github.com:stbsdk/shim-classlist.git'},
            'shim-bind':           {name: 'stb-shim-bind', url: 'git@github.com:stbsdk/shim-bind.git'},
            'shim-frame':          {name: 'stb-shim-frame', url: 'git@github.com:stbsdk/shim-frame.git'},
            'stbsdk':              {name: 'stbsdk', url: 'git@github.com:stbsdk/stbsdk.git'},
            'plugin-css':          {name: 'stb-plugin-css', url: 'git@github.com:stbsdk/plugin-css.git'},
            'plugin-proxy':        {name: 'stb-plugin-proxy', url: 'git@github.com:stbsdk/plugin-proxy.git'},
            'plugin-sass':         {name: 'stb-plugin-sass', url: 'git@github.com:stbsdk/plugin-sass.git'},
            'plugin-ssh':          {name: 'stb-plugin-ssh', url: 'git@github.com:stbsdk/plugin-ssh.git'},
            'plugin-webpack':      {name: 'stb-plugin-webpack', url: 'git@github.com:stbsdk/plugin-webpack.git'},
            'plugin-weinre':       {name: 'stb-plugin-weinre', url: 'git@github.com:stbsdk/plugin-weinre.git'}
        }
    },
    root = process.cwd(),
    home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    libs = path.join(home, '.node_libraries');


function isGlobalPackage ( name ) {
    try {
        if ( require.resolve(name) ) {
            //console.log(name + ' found');
            return true;
        }
    } catch ( e ) {
        //console.log(name + ' not found!');
        return false;
    }
}


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
    Object.keys(repos).forEach(function ( orgName ) {
        var orgPath = path.join(root, orgName);

        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            if ( !fs.existsSync(path.join(orgPath, repoName)) ) {
                //console.log(repos[orgName][repoName].url);
                exec('git', [
                    'clone',
                    '--progress',
                    //util.format('git@github.com:%s/%s.git', orgName, repoName),
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
                });
            }
        });
    });
};


methods.pull = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
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
            });
        });
    });
};


methods.push = function () {
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
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
            });
        });
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
                    })
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
                    dstName = path.join(root, orgName, repoName),
                    srcName = path.join(root, 'node_modules', pkgName || '');

                if ( pkgName && !fs.existsSync(srcName) ) {
                    fs.symlinkSync(dstName, srcName, 'dir');
                    console.log('+' + srcName + ' -> ' + dstName);
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
    Object.keys(repos).forEach(function ( orgName ) {
        Object.keys(repos[orgName]).forEach(function ( repoName ) {
            var info = require(path.join(root, orgName, repoName, 'package.json'));

            if ( info.scripts && info.scripts.sass ) {
                //console.log(info.name);
                exec('npm', ['run-script', 'sass'], {cwd: path.join(root, orgName, repoName)}, function ( error, stdout, stderr ) {
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


// exec given command
if ( methods[process.argv[2]] ) {
    methods[process.argv[2]]();
} else {
    console.log('Available commands:', Object.keys(methods).join(', '));
}
