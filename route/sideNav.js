module.exports.createSideNav = function(destination) {
    var ret_str = "<li class='nav-header'>competitions</li>\n";
    
    var sideLinks = ["competitions", "rankings", "forums"];
    var sideLinkNames = ["Competitions", "User Rankings", "Discussion Forums"];

    for (var i = 0; i < sideLinks.length; i++) {
	ret_str = ret_str + "<li";
	if (destination === sideLinks[i])
	    ret_str = ret_str + " class='active'";
	ret_str = ret_str + "><a href='/" + sideLinks[i] + "'>" + sideLinkNames[i] + "</a></li>\n";
    }

    ret_str = ret_str + "<li class='nav-header'>My Account</li>\n";

    ret_str = ret_str + "<li";
    if (destination === "profile")
	ret_str = ret_str + " class='active'";
    ret_str = ret_str + "><a href='/profile'>My Profile</a></li>\n";
    
    ret_str = ret_str + "<li";
    if (destination === "profile#settings")
	ret_str = ret_str + " class='active'";
    ret_str = ret_str + "><a href='/profile#settings'>Settings</a></li>\n";

    ret_str = ret_str + "<li class='nav-header'>Want to host a competition?</li>\n";
    
    ret_str = ret_str + "<li";
    if (destination === "newContest")
	ret_str = ret_str + " class='active'";
    ret_str = ret_str + "><a href='/newContest'>Host Now</a></li>\n";

    return ret_str;
};
