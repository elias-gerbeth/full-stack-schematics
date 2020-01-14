import { SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

export function addExportsToBarrelFile(barrelFilePath: string, exportRelativePaths: string[]) {
    return (tree: Tree, context: SchematicContext): Tree => {
        // Add export to barrel file
        if (!tree.exists(barrelFilePath)) {
            throw new SchematicsException('❌ barrel file does not exist ' + barrelFilePath);
        }
        let content = tree.read(barrelFilePath).toString();
        content = content + '\n';
        for (const path of exportRelativePaths) {
            const imports = `export * from '${path}';`;
            content = content + imports + '\n';
        }
        content = content + '\n';
        tree.overwrite(barrelFilePath, content);
        return tree;
    };
}
