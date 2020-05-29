
function isAllowedContent(itemGroup, userRoles, config) {
    console.log('Checking', itemGroup, userRoles);
    // If meta group is not set then its available to all users (that are logged in)
    if(!itemGroup) {
        return true;
    }

    // If user does not have any rules or the user doesn't have the restricted role
    // Return false to exclude this content
    return userRoles && userRoles.indexOf(config.restricted) >= 0;
}

exports.default = {
    isAllowedContent
};
module.exports = exports.default;
  