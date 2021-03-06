var hapi = require('hapi');
var rp = require('request-promise');
var config = {
    apiUrl: process.env.API_URL,
    token: process.env.AUTH_TOKEN
};
var sprints = {};

sprints.get = function(request, reply) {
    var options = {
        uri: config.apiUrl + '/iterations',
        qs: {
            format: 'json'
        },
        headers: {
            'Authorization': config.token
        },
        json: true // Automatically parses the JSON string in the response 
    };
    return rp(options)
        .then(function(data) {
            reply.view('sprints', {
                sprints: data.Items
            });
        })
        .catch(function(err) {
            console.error(err);
        });
}

sprints.getSprintTasks = function(request, reply) {
    var options = {
        uri: config.apiUrl + '/tasks',
        qs: {
            format: 'json',
            where: '(Iteration.id eq ' + request.params.sprintId + ')',
            orderByDesc: 'CreateDate',
            take: 500,
            include: '[Name, Owner, Iteration, Iteration[StartDate], CreateDate, UserStory]'
        },
        headers: {
            'Authorization': config.token
        },
        json: true // Automatically parses the JSON string in the response 
    };
    return rp(options)
        .then(function(data) {
            reply.view('task-list', {
                tasks: data.Items
            });
        })
        .catch(function(err) {
            console.error(err);
        });
}

sprints.getCurrentSprintTasks = function(request, reply) {
    var options = {
        uri: config.apiUrl + '/iterations',
        qs: {
            format: 'json',
            where: '(IsCurrent eq "true")',
            include: '[Id]'
        },
        headers: {
            'Authorization': config.token
        },
        json: true // Automatically parses the JSON string in the response 
    };
    return rp(options)
        .then(function(data) {
            console.log(data.Items[0].Id)
            reply.redirect('/sprints/' + data.Items[0].Id);
        })
        .catch(function(err) {
            console.error(err);
        });
}

module.exports = sprints;
