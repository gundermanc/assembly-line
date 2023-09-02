// Inspired by this AssemblyScript compiler sample: https://github.com/AssemblyScript/examples/tree/main/transform
//
// After a heated multi-day battle with NodeJS Module loader + TS module resolution behaviors
// I emerged defeated and gave up using TypeScript in this one small part.

import * as assemblyscript from "assemblyscript";
import { Transform } from "assemblyscript/transform";
import binaryen from "binaryen";

class MyTransform extends Transform {
  afterCompile(asModule) {
    console.log("Compiled!");
  }
}

export default MyTransform;