#!/usr/bin/env node

/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var program  = require('commander'),
    pkgData  = require('../package.json'),
    commands = require('./commands');


program
    .version(pkgData.version)
    .usage('[options] <command> [<agrs>]')
    .description(pkgData.description)
    .option('-d, --debug [filter]', 'output debug information with filtering');

program
    .command('clone')
    .description('clone all repositories')
    .action(commands.clone);

program
    .command('status')
    .description('get status of all repositories')
    .action(commands.status);

program
    .command('pull')
    .description('pull all repositories')
    .action(commands.pull);

program
    .command('push')
    .description('push all repositories')
    .action(commands.push);

program
    .command('link')
    .description('create symlinks for all repositories')
    .action(commands.link);

program
    .command('unlink')
    .description('remove symlinks for all repositories')
    .action(commands.unlink);

program
    .command('lint')
    .description('perform eslint validation for all repositories')
    .action(commands.lint);

program.on('--help', function () {
    console.log('\n  Examples:');
    console.log('');
    console.log('    $ sdk -d clone');
    console.log('    $ sdk --debug=app:* clone');
    console.log('');
});

program.parse(process.argv);

// show help if no cli params
if ( !process.argv.slice(2).length ) {
    program.outputHelp();
}


//global.DEVELOP = true;

// enable colors in console
//require('tty-colors');

//console.log(program);

// require('../lib/app').init({
//     tasks: program.args,
//     //plugins: Object.keys(pkgData.optionalDependencies)
//     plugins: [
//         'spa-plugin-jade',
//         'spa-plugin-livereload',
//         'spa-plugin-sass',
//         'spa-plugin-static',
//         'spa-plugin-wamp',
//         'spa-plugin-webpack',
//         'spa-webui'
//     ]
// });/**/
