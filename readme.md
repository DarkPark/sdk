SDK deployment management
=========================

## Production deployment ##

Install global packages:

```bash
sudo npm install -g eslint
sudo npm install -g spasdk/spasdk
sudo npm install -g stbsdk/stbsdk
sudo npm install -g magsdk/magsdk
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

If you have any problem or suggestion please open an issue [here](https://github.com/DarkPark/sdk/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs).


## License ##

`sdk` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
