import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Your extension "Open File from Path" is now active!');

    let disposable = vscode.commands.registerCommand('extension.openFileFromPath', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        const currentLine = editor.selection.active.line;
        const lineText = document.lineAt(currentLine).text.trim();

        await openFileIfExists(lineText);
    });

    context.subscriptions.push(disposable);
}

export async function openFileIfExists(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
        const fileUri = vscode.Uri.file(filePath);
        await vscode.window.showTextDocument(fileUri);
    } else {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            const absolutePath = path.join(workspaceFolder.uri.fsPath, filePath);
            if (fs.existsSync(absolutePath)) {
                const fileUri = vscode.Uri.file(absolutePath);
                await vscode.window.showTextDocument(fileUri);
                return;
            }
        }
        vscode.window.showErrorMessage('File not found: ' + filePath);
    }
}

export function deactivate() {}