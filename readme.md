SDK deployment management
=========================


## Usage ##

Install optional global dependencies:

```bash
sudo npm install -g mocha should eslint gulp-cli jsdoc
```

Clone all repositories:

```bash
./run.sh clone
```

Update all repositories:

```bash
./run.sh pull
```

Push commits for all repositories:

```bash
./run.sh push
```

List all packages with versions:

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

`stb` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
