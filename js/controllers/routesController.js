'use strict';

module.exports = (app) => {
  const _validUrl = domain => '/\`${app.get("DOMAIN_VALID")}`/'.exec(domain); 

  return {
    validUrl: _validUrl
  }
}
