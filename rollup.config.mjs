import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/cjs/index.js",
                format: "cjs",
            },
            {
                file: "dist/esm/index.js",
                format: "esm",
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
        ],
        external: ["react", "react-dom", "formik"]
    },
    {
        input: "dist/esm/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
    },
];
