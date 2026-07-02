import { debug } from '@actions/core';
import { URL } from 'url';
import { createHash } from 'crypto';
import { get as HTTP } from 'http';
import { get as HTTPS, request } from 'https';
function stream(url, headers, cb) {
    return new Promise((resolve, reject) => {
        ;
        (url.protocol == 'https:' ? HTTPS : HTTP)(url, { headers }, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
                const loc = res.headers['location'];
                res.resume();
                if (loc == null)
                    throw `HTTP ${res.statusCode} but no Location header`;
                const nextURL = new URL(loc);
                log(nextURL);
                resolve(stream(nextURL, headers, cb));
                return;
            }
            else if (res.statusCode && res.statusCode >= 400) {
                res.resume();
                throw new Error(`HTTP ${res.statusCode}`);
            }
            res.on('data', (d) => cb(d));
            res.on('end', () => resolve());
        }).on('error', (err) => reject(err));
    });
}
async function resolveRedirect(apiClient, url, asBinary) {
    const authInfo = (await apiClient.auth());
    return new Promise((resolve, reject) => {
        const req = request(url, {
            method: 'HEAD',
            headers: {
                authorization: authInfo.token ? `bearer ${authInfo.token}` : '',
                accept: asBinary ? 'application/octet-stream' : '*/*',
                'User-Agent': 'bump-homebrew-formula-action',
            },
        }, (res) => {
            res.resume(); // ensure the response body has been fully read
            if (res.statusCode == 302) {
                const loc = res.headers['location'];
                if (loc != null) {
                    resolve(new URL(loc));
                }
                else {
                    reject(new Error(`got HTTP ${res.statusCode} but no Location header`));
                }
            }
            else {
                reject(new Error(`unexpected HTTP ${res.statusCode} response`));
            }
        });
        req.end();
    });
}
async function resolveDownload(apiClient, url) {
    if (url.hostname == 'github.com') {
        const api = apiClient.rest;
        const archive = parseArchiveUrl(url);
        if (archive != null) {
            const archiveType = archive.ext == '.zip' ? 'zipball' : 'tarball';
            const endpoint = new URL(`https://api.github.com/repos/${archive.owner}/${archive.repo}/${archiveType}/${archive.ref}`);
            const loc = await resolveRedirect(apiClient, endpoint, false);
            // HACK: removing "legacy" from the codeload URL ensures that we get the
            // same archive file as web download. Otherwise, the downloaded archive
            // contains resolved commit SHA instead of the tag name in directory path.
            return new URL(loc.href.replace('/legacy.', '/'));
        }
        const download = parseReleaseDownloadUrl(url);
        if (download != null) {
            const { owner, repo } = download;
            const tag = download.tagname;
            const res = await api.repos.getReleaseByTag({ owner, repo, tag });
            const asset = res.data.assets.find((a) => a.name == download.name);
            if (asset == null) {
                throw new Error(`could not find asset '${download.name}' in '${tag}' release`);
            }
            return await resolveRedirect(apiClient, new URL(asset.url), true);
        }
    }
    return url;
}
export function parseArchiveUrl(url) {
    const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/archive\/(.+)(\.tar\.gz|\.zip)$/);
    if (match == null) {
        return null;
    }
    return {
        owner: match[1],
        repo: match[2],
        ref: match[3],
        ext: match[4],
    };
}
export function parseReleaseDownloadUrl(url) {
    const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/releases\/download\/(.+)$/);
    if (match == null) {
        return null;
    }
    const parts = match[3].split('/');
    if (parts.length < 2) {
        return null;
    }
    const name = parts.pop() || '';
    return {
        owner: match[1],
        repo: match[2],
        tagname: decodeURIComponent(parts.join('/')),
        name: name,
    };
}
function log(url) {
    const params = Array.from(url.searchParams.keys());
    const q = params.length > 0 ? `?${params.join(',')}` : '';
    debug(`GET ${url.protocol}//${url.hostname}${url.pathname}${q}`);
}
export default async function (api, url, algorithm) {
    const downloadUrl = await resolveDownload(api, new URL(url));
    const requestHeaders = { accept: 'application/octet-stream' };
    const hash = createHash(algorithm);
    log(downloadUrl);
    await stream(downloadUrl, requestHeaders, (chunk) => hash.update(chunk));
    return hash.digest('hex');
}
//# sourceMappingURL=calculate-download-checksum.js.map