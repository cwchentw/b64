# b64

A lightweight, high-performance Base64 encoder and decoder written in TypeScript.

## Why use b64?

*   **TypeScript Native**: Built with type safety in mind, ensuring robust data handling.
*   **Zero Dependencies**: Minimalistic implementation without the bloat of external libraries.
*   **Cross-Platform**: Works seamlessly across any environment that runs Node.js.

## System Requirements

*  A recent Node.js

## Install

Clone the repository and build the project locally:

```sh
$ git clone https://github.com/cwchentw/b64.git
$ cd b64
$ npm install
$ npm run build
```

## Usage

`b64` can be used as a command-line tool to encode or decode files.

### Encoding a file

To encode a binary file (e.g., `db.sqlite`) into a Base64 text file:

```sh
$ b64 -o output.b64 db.sqlite
```

### Decoding a file

To restore the original binary file from a Base64 encoded file:

```sh
$ b64 -d -o db.sqlite output.b64
```

## Author

**ByteBard**

## License

[MIT](LICENSE)
