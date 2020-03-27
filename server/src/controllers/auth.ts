const CASAuthentication = require('../lib/CASAuth')
import { CASOptionsType } from '../lib/CASOptions';


/* CAS Authentication functions

Middleware:
-  cas.bounce: Unauthenticated clients will be redirected to the CAS login and then back to
              the route once authenticated.
-  cas.block:  Unauthenticated clients will receive a 401 Unauthorized response instead of data.

Endpoint functions:
-  cas.bounce_redirect: 
              Unauthenticated clients will be redirected to the CAS login and then to the
              provided "redirectTo" query parameter once authenticated (only used in login flow).
  
-  cas.logout: De-authenticate the client with the Express server and then            
              redirect the client to the CAS logout page.
*/
const CAS = (options: CASOptionsType) => new CASAuthentication(options)


export default CAS;