const vscode = require("vscode");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("genjs.helloWorld", function () {
      vscode.window.showInformationMessage("Hello World from !");
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
