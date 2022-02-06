var vscode = require("vscode");
var fs = require("fs");
var path = require("path");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "purescript-vscode-genjs.genjs",
      function () {
        var filePath = vscode.window.activeTextEditor.document.uri.fsPath;
        var dirPath = path.dirname(filePath);
        var fileName = path.basename(filePath);
        var jsFileName = fileName.replace(".purs", ".js");
        var jsFilePath = path.resolve(dirPath, jsFileName);

        var code = fs.readFileSync(filePath).toString();
        var genCode = code
          .split("\n")
          .filter((a) => /^foreign import/.test(a))
          .filter((a) => !/^foreign import data/.test(a))
          .map((a) =>
            a.match(/foreign import (.*?)::(.*)/).map((a) => a.trim())
          )
          .map((a) =>
            [`// ${a[1]} :: ${a[2]}`, `exports.${a[1]} = 1;`].join("\n")
          )
          .join("\n\n");

        var oldCode = [];
        if (fs.existsSync(jsFilePath)) {
          oldCode = [
            fs.readFileSync(jsFilePath).toString(),
            "// ------------------",
          ];
        }

        fs.writeFileSync(jsFilePath, [...oldCode, genCode, ""].join("\n"));
        vscode.window.showInformationMessage("文件已生成");
      }
    )
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
