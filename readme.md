SDK deployment management
=========================


## Usage ##

Install optional global dependencies:

```bash
sudo npm install -g eslint jsdoc
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

Install dependencies for all repositories:

```bash
npm run-script install
```

Create symbolic links for all repositories:

```bash
npm run-script link
```

Remove symbolic links for all repositories:

```bash
npm run-script unlink
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
