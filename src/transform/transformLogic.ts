
//import { Transform } from "assemblyscript/dist/asc";
import { Module } from "assemblyscript/dist/assemblyscript";

// HACK: Not sure why, extending Transform breaks runtime resolution.
export class TransformLogic /* extends Transform */  {
    public afterCompile(module: Module): void | Promise<void> {
        console.log("Nothing");
    }
}
