import * as vscode from 'vscode';
import * as hasha from 'hasha';

export function activate(context: vscode.ExtensionContext) {
  let commandMd5 = vscode.commands.registerCommand('rash.md5', async (uri: vscode.Uri) => {
    const hashValue = await calculateHash(uri, 'md5');

    if (!hashValue) {
      vscode.window.showErrorMessage(`Unable to calculate MD5 for file: ${uri.fsPath}`);
      return;
    }

    await vscode.env.clipboard.writeText(hashValue).then(() => {
      vscode.window.showInformationMessage(`MD5 copied to clipboard`);
    });
  });

  let commandSha256 = vscode.commands.registerCommand('rash.sha256', async (uri: vscode.Uri) => {
    const hashValue = await calculateHash(uri, 'sha256');

    if (!hashValue) {
      vscode.window.showErrorMessage(`Unable to calculate Sha256 for file: ${uri.fsPath}`);
      return;
    }

    await vscode.env.clipboard.writeText(hashValue).then(() => {
      vscode.window.showInformationMessage(`Sha256 copied to clipboard`);
    });
  });

  let commandMd5Text = vscode.commands.registerCommand('rash.md5-text', async () => {
    return calculateHashForText('MD5');
  });

  let commandSha256Text = vscode.commands.registerCommand('rash.sha256-text', async () => {
    return calculateHashForText('Sha256');
  });

  context.subscriptions.push(commandMd5);
  context.subscriptions.push(commandSha256);
  context.subscriptions.push(commandMd5Text);
  context.subscriptions.push(commandSha256Text);
}

async function calculateHash(filePath: vscode.Uri, hashType: string): Promise<string | null> {
  return await hasha.fromFile(filePath.fsPath, {
    algorithm: hashType,
  });
}

async function calculateHashForText(hashType: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const text = editor.document.getText(editor.selection);
  const hashValue = await hasha.async(text, { algorithm: hashType });

  if (!hashValue) {
    vscode.window.showErrorMessage(`Unable to calculate ${hashType} for text selection.`);
    return;
  }

  await vscode.env.clipboard.writeText(hashValue).then(() => {
    vscode.window.showInformationMessage(`${hashType} copied to clipboard`);
  });
}

export function deactivate() {}
