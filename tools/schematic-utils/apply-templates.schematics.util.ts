import { strings } from '@angular-devkit/core';
import { apply, branchAndMerge, chain, mergeWith, renameTemplateFiles, template, url } from '@angular-devkit/schematics';

export function applyAndMergeTemplates(options: any) {
    return branchAndMerge(chain([
        mergeWith(apply(url('./files'), [
            template({ ...strings, ...options }),
            renameTemplateFiles(),
        ])),
    ]));
}
