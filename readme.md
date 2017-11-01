SDK deployment management
=========================

## Production deployment ##

Install global packages:

```bash
sudo npm install -g eslint
sudo npm install -g spasdk
sudo npm install -g stbsdk
sudo npm install -g magsdk
```


## Development deployment ##

Install optional global dependencies:

```bash
sudo npm install -g eslint jsdoc
```

Get meta repo:

```bash
git clone https://github.com/DarkPark/sdk.git
# or for Github users with granted access
git clone git@github.com:DarkPark/sdk.git
cd sdk
```

Clone all repositories:

```bash
npm run-script clone
```

Update all repositories:

```bash
npm run-script pull
```

Push commits for all repositories:

```bash
npm run-script push
```

Install common dependencies:

```bash
npm install
```

Create symbolic links for all repositories:

```bash
npm run-script link
```

Remove symbolic links for all repositories:

```bash
npm run-script unlink
```

Update common dependencies:

```bash
# links have to be removed due to conflicts
npm run-script unlink
npm update
# now links can be restored
npm run-script link
```

Make main packages globally available (similar to `npm link`):

```bash
sudo ln -sr ./spasdk/spasdk /usr/lib/node_modules/spasdk
sudo ln -sr ./stbsdk/stbsdk /usr/lib/node_modules/stbsdk
sudo ln -sr ./magsdk/magsdk /usr/lib/node_modules/magsdk
sudo ln -s /usr/lib/node_modules/spasdk/bin/cli.js /usr/bin/spasdk
sudo ln -s /usr/lib/node_modules/stbsdk/bin/cli.js /usr/bin/stbsdk
sudo ln -s /usr/lib/node_modules/magsdk/bin/cli.js /usr/bin/magsdk
```


## Project creation ##

Get a new project base (one of the following):

```bash
git clone https://github.com/spasdk/boilerplate.git my-project
git clone https://github.com/stbsdk/boilerplate.git my-project
git clone https://github.com/magsdk/boilerplate.git my-project
```

Move to the project dir and install all required dependencies:

```bash
cd my-project
npm install
```

Replace git repository link with your own if necessary:

```bash
git remote remove origin
git remote add origin [new repository address]
```

For a development deployment to omit dependencies installation and regular `npm update` checks
it's possible to skip `npm install` and create symlinks:

```bash
node [path to this sdk repo index.js] link
```

Build and start services (one of the following):

```bash
spasdk
stbsdk
magsdk
```

Or for a development mode (one of the following):

```bash
DEBUG=* spasdk
DEBUG=* stbsdk
DEBUG=* magsdk
```




## Outdated instructions ##

Install dependencies for all repositories:

```bash
npm run-script install
```

??? List all packages with versions:

```bash
./run.sh version
```

Bind the necessary packages to the target project:

```bash
sudo ./run.sh bind [path to the project]
```

Unbind all bind packages in the target project:

```bash
sudo ./run.sh unbind [path to the project]
```


## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/DarkPark/sdk/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`sdk` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
