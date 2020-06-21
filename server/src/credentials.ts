
import { join } from 'path'
import { readFileSync } from 'fs'
import { JWT } from 'google-auth-library'

const auth = new JWT('', '', '', [
    'https://www.googleapis.com/auth/admin.directory.group',
    'https://www.googleapis.com/auth/admin.directory.user'
], 'morriser@fysiksektionen.se');

const keyFilePath = join(__dirname, 'service_account.json');
const keyJson = JSON.parse(readFileSync(keyFilePath, {encoding: 'utf8'}));

export const primaryDomain = "fysiksektionen.se";
export const secondaryDomains = ["f.kth.se"];
export const primaryEmailDomain = "@" + primaryDomain;
export const secondaryEmailDomains = secondaryDomains.map(d => '@'+d);
export const allDomains: string[] = [primaryDomain, ...secondaryDomains];
export const allDomainsEmail: string[] = allDomains.map(d => '@'+d);

auth.fromJSON(keyJson);

export default auth;