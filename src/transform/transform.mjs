// Inspired by this AssemblyScript compiler sample: https://github.com/AssemblyScript/examples/tree/main/transform
//
// After a heated multi-day battle with NodeJS Module loader + TS module resolution behaviors
// I emerged defeated and gave up using TypeScript in this one small part.

import * as assemblyscript from "assemblyscript";
import { Transform } from "assemblyscript/transform";
import binaryen from "binaryen";
import { TransformLogic } from "./transformLogic.js";

class MyTransform extends Transform {
  afterCompile(asModule) {
    new TransformLogic().afterCompile(asModule);
  }
}

export default MyTransform;