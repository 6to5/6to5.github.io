/* global jQuery */

(function($){
    var githubIssuesEndpoint;
    var githubHTMLBeginnerFriendlyURL;
    var githubHTMLHelpWantedURL;

    var ISSUES_LIMIT = 5;

    switch(window.location.pathname){
        case "/contributing/babel":
            githubIssuesEndpoint = 'https://api.github.com/repos/babel/babel/issues';
            githubHTMLBeginnerFriendlyURL = "https://github.com/babel/babel/labels/beginner-friendly";
            githubHTMLHelpWantedURL = "https://github.com/babel/babel/labels/help%20wanted";
            break;
        case "/contributing/babili":
            githubIssuesEndpoint = 'https://api.github.com/repos/babel/babili/issues';
            githubHTMLBeginnerFriendlyURL = "https://github.com/babel/babili/labels/beginner-friendly";
            githubHTMLHelpWantedURL = "https://github.com/babel/babili/labels/help%20wanted";
            break;
        case "/contributing/babylon":
            githubIssuesEndpoint = 'https://api.github.com/repos/babel/babylon/issues';
            githubHTMLBeginnerFriendlyURL = "https://github.com/babel/babylon/labels/beginner-friendly";
            githubHTMLHelpWantedURL = "https://github.com/babel/babylon/labels/help%20wanted";
            break;
        case "/contributing/babel-preset-env":
            githubIssuesEndpoint = 'https://api.github.com/repos/babel/babel-preset-env/issues';
            githubHTMLBeginnerFriendlyURL = "https://github.com/babel/babel-preset-env/labels/beginner-friendly";
            githubHTMLHelpWantedURL = "https://github.com/babel/babel-preset-env/labels/help%20wanted";
            break;
        default:
            throw "no github endpoint available for " + window.location.pathname;
            break;
    }

    $.ajax(githubIssuesEndpoint, {
            data: {
                labels: 'beginner-friendly'
            },
            success: function(data){
                var limitedData = _.take(data, ISSUES_LIMIT);

                _.forEach(limitedData, function(issue) {
                    $('.open-issues-section--beginner .issues').append('<li class="issue"><a href="' + issue.html_url + '"><span class="issue__number">#' + issue.number +'</span><span class="issue__title">' + issue.title + '</span></a></li>');
                });
            },
            error : function(xhr, status, error){
                $('.open-issues-section--beginner .issues').append('<li><a href="' + githubHTMLBeginnerFriendlyURL + '"><span>Failed to load issues. View Beginner-Friendly issues on Github.</span></a></li>');
                throw error;
            }
        }
    );

    $.ajax(githubIssuesEndpoint, {
            data: {
                labels: 'help wanted'
            },
            success: function(data){
                var filteredData = _.filter(data, function(issue) {
                    return !_.find(issue.labels, function(label) {
                        return label.name === "beginner-friendly";
                    });
                });

                var limitedData = _.take(filteredData, ISSUES_LIMIT);

                _.forEach(limitedData, function(issue) {
                    $('.open-issues-section--help-wanted .issues').append('<li class="issue"><a href="' + issue.html_url + '"><span class="issue__number">#' + issue.number +'</span><span class="issue__title">' + issue.title + '</span></a></li>');
                });
            },
            error: function(xhr, status, error){
                $('.open-issues-section--help-wanted .issues').append('<li><a href="' + githubHTMLHelpWantedURL + '"><span>Failed to load issues. View Help-Wanted issues on Github.</span></a></li>');
                throw error;
            }
        }
    );

})(jQuery);
