module.exports.createTopNav = function(destination) {
    var ret_str = "<li><a href='/competitions'>Home</a></li>\n";
    ret_str = ret_str + "<li><a href='http://blog.3dthon.com' target='none'>Blog</a></li>\n";
    
    var links = ["competitions", "rankings", "newContest", "profile"];
    var linkNames = ["Competitions", "User Rankings", "Host Now", "Profile"];
    
    for (var i = 0; i < links.length; i++) {
	ret_str = ret_str + "<li";
	if (destination === links[i]) 
	    ret_str = ret_str + " class='active'";
	ret_str = ret_str + "><a href='/" + links[i] + "'>" + linkNames[i] + "</a></li>\n";
    }
    
    ret_str = ret_str + "<li><a href='/signout'>Sign Out</a></li>\n";
    
    return ret_str;
};
