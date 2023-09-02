import { Program } from "assemblyscript";
import asc from "assemblyscript/asc";

export class Transpiler {
    async compile(): Promise<void> {
        try {
            const { error, stdout, stderr, stats } = await asc.main([
              // Command line options
              'C:\\repos\\assembly-line\\src\\example\\foo.ts',
              "--outFile", "myModule.wasm",
              "--optimize",
              "--sourceMap",
              "--stats",
              "--transform", "C:\\repos\\assembly-line\\dist\\transform.mjs"
            ], {
            //   // Additional API options
            //   stdout?: ...,
            //   stderr?: ...,
            //   readFile?: ...,
            //   writeFile?: ...,
            //   listFiles?: ...,
            //   reportDiagnostic?: ...,
            //   transforms?: ...
            //    transforms: [ new MyTransform() ]
            });
            if (error) {
              console.log("Compilation failed: " + error.message);
              console.log(stderr.toString());
            } else {
              console.log(stdout.toString());
            }
    
        } catch (e) {
            console.log(e);
        }
    }
}

const compiler = new Transpiler();

compiler.compile();
