import { isDebug } from '@actions/core';
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import { requestLog } from '@octokit/plugin-request-log';
const GitHub = Octokit.plugin(restEndpointMethods, requestLog).defaults({
    baseUrl: 'https://api.github.com',
});
export default function (token, options) {
    return new GitHub({
        request: { fetch: options && options.fetch },
        auth: `token ${token}`,
        log: {
            info(msg) {
                if (options && options.logRequests === false)
                    return;
                return console.info(msg);
            },
            debug(msg) {
                if (!isDebug())
                    return;
                return console.debug(msg);
            },
            warn(msg) {
                return console.warn(msg);
            },
            error(msg) {
                return console.error(msg);
            },
        },
    });
}
//# sourceMappingURL=api.js.map