
import { join } from 'path'
import { readFileSync } from 'fs'
import { JWT } from 'google-auth-library'

const auth = new JWT('', '', '', [
    'https://www.googleapis.com/auth/admin.directory.group.readonly',
    'https://www.googleapis.com/auth/admin.directory.group.member.readonly',
], 'morriser@fysiksektionen.se');

const keyFilePath = join(__dirname, 'service_account.json');
const keyJson = JSON.parse(readFileSync(keyFilePath, {encoding: 'utf8'}));

auth.fromJSON(keyJson);

export default auth;