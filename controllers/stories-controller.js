var hapi = require('hapi');
var rp = require('request-promise');
var config = require('config');
var stories = {};

stories.getStory = function(request, reply) {
    var options = {
        uri: config.apiUrl + '/userstories/' + request.params.id,
        qs: {
            format: 'json',
            include: '[Tasks, Iteration, Tasks[EntityState], Name]'
        },
        headers: {
            'Authorization': config.token
        },
        json: true // Automatically parses the JSON string in the response 
    };
    return rp(options)
        .then(function(data) {
            reply.view('story', {
                story: data
            });
        })
        .catch(function(err) {
            console.error(err);
        });
}

stories.get = function(request, reply) {
    var options = {
        uri: config.apiUrl + '/userstories',
        qs: {
            format: 'json',
            include: '[Tasks, Iteration, Name]',
            where: '(Iteration.Id eq ' + request.params.sprintId + ')'
        },
        headers: {
            'Authorization': config.token
        },
        json: true // Automatically parses the JSON string in the response 
    };
    return rp(options)
        .then(function(data) {
            console.log(data)
            reply.view('stories', {
                stories: data.Items
            });
        })
        .catch(function(err) {
            console.error(err);
        });

}

module.exports = stories;
