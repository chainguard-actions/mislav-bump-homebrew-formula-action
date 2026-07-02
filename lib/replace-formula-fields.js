import { compare, fromUrl } from './version.js';
export class UpgradeError extends Error {
}
function assertNewer(v1, v2) {
    const c = compare(v1, v2);
    if (c == 0) {
        throw new UpgradeError(`the formula is already at version '${v1}'`);
    }
    else if (c == -1) {
        throw new UpgradeError(`the formula version '${v2}' is newer than '${v1}'`);
    }
}
function escape(value, char) {
    return value.replace(new RegExp(`\\${char}`, 'g'), `\\${char}`);
}
export function replaceFields(oldContent, replacements) {
    let newContent = oldContent;
    for (const [field, value] of replacements) {
        newContent = newContent.replace(new RegExp(`^(\\s*)${field}((?::| *=>)? *)(['"])([^'"]+)\\3`, 'm'), (_, indent, sep, q, old) => {
            if (field == 'version')
                assertNewer(value, old);
            else if (field == 'url' && !value.endsWith('.git'))
                assertNewer(fromUrl(value), fromUrl(old));
            return `${indent}${field}${sep}${q}${escape(value, q)}${q}`;
        });
    }
    return newContent;
}
export function removeRevisionLine(oldContent) {
    return oldContent.replace(/^[ \t]*revision \d+ *\r?\n/m, '');
}
//# sourceMappingURL=replace-formula-fields.js.map