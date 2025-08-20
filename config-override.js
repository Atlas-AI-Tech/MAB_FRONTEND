import {
    addWebpackModuleRule,
    addWebpackPlugin,
    override,
  } from "customize-cra";
  import JavaScriptObfuscator from "webpack-obfuscator";
  
  export default override(
    addWebpackPlugin(
      new JavaScriptObfuscator(
        {
          rotateUnicodeArray: true,
        },
        ["excluded_bundle_name.js"]
      )
    ),
    // Add a Webpack rule to handle pdfjs-dist worker
    addWebpackModuleRule({
      test: /pdf\.worker\.js$/,
      use: { loader: "worker-loader" },
    })
  );
  