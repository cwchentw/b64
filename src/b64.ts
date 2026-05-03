import * as fs from 'fs';

const PROGRAM = 'base64';
const VERSION = '0.2.0';

function helpInfo({ stream = 'stdout' }: { stream?: 'stdout' | 'stderr' } = {}) {
    const log = (stream === 'stderr') ? console.error : console.log;

    log(`Usage: ${PROGRAM} [options] file`);
    log('');
    log('Options:');
    log('');
    log("\t-v, --version\t\tShow version info");
    log("\t-h, --help\t\tShow help info");
    log("\t-d, --decode\t\tDecode mode (Base64 string to file)");
    log("\t-o <file>\t\tOutput file path");
}

function encodeFileToBase64(filePath: string): string {
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
}

function decodeBase64ToBuffer(input: string): Buffer {
    const dataUriRegex = /^data:.+;base64,(.+)$/;
    const matches = input.match(dataUriRegex);
    const base64Content = matches ? matches[1] : input;
    
    if (base64Content) return Buffer.from(base64Content, 'base64');

    throw new Error("No base 64 string");
}

interface ActionBase {
    action: 'version' | 'help';
}

interface ActionFilePath {
    action: 'file-path';
    file: string;
    output?: string;
    decode: boolean;
}

type Argument = ActionBase | ActionFilePath;

function parseArgs(args: string[]): Argument {
    let i = 0;
    let outputFile: string | undefined;
    let isDecode = false;

    while (i < args.length) {
        const arg = args[i];

        if (arg === '-v' || arg === '--version') return { action: 'version' };
        if (arg === '-h' || arg === '--help') return { action: 'help' };

        if (arg === '-d' || arg === '--decode') {
            isDecode = true;
            i++;
            continue;
        }

        if (arg === '-o') {
            outputFile = args[i + 1];
            if (!outputFile) throw new Error('No valid output file path');
            i += 2;
            continue;
        }

        if (arg) return {
            action: 'file-path',
            file: arg,
            output: outputFile,
            decode: isDecode
        };
    }

    throw new Error('No file path provided');
}

function main(argv: string[]): number {
    try {
        const result = parseArgs(argv);

        if (result.action === 'version') {
            console.log(VERSION);
            return 0;
        }

        if (result.action === 'help') {
            helpInfo();
            return 0;
        }

        if (result.action === 'file-path') {
            if (result.decode) {
                const base64Input = fs.readFileSync(result.file, 'utf-8').trim();
                const buffer = decodeBase64ToBuffer(base64Input);
                const outPath = result.output || 'output.bin';
                
                fs.writeFileSync(outPath, buffer);
                console.log(`Successfully decoded to: ${outPath}`);
            } else {
                const base64String = encodeFileToBase64(result.file);
                
                if (result.output) {
                    fs.writeFileSync(result.output, base64String);
                    console.log(`Base64 string saved to: ${result.output}`);
                } else {
                    console.log(base64String);
                }
            }
            return 0;
        }

        return 0;
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        helpInfo({ stream: 'stderr' });
        return 1;
    }
}

if (typeof process !== 'undefined' && process.argv) {
    process.exit(main(process.argv.slice(2)));
}