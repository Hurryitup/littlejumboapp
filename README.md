## Linting

Please lint your code using JSHint (`^J` on Sublime Text after installing the
package 'JSHint' and `npm install -g jshint`) before pushing. @duci9y set up a
strict `.jshintrc` but feel free to make changes to it after letting others know
about them.

## API

Endpoints were designed following the best practices outlined
[here](http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api).
Open to discussion and modification.

    GET /api/visiting_days
    GET /api/visiting_days/:id?populate=<field>,<field>
    POST /api/visiting_days

If `:id` is `new`, create both resources in one request:

    POST /api/visiting_days/:id/composite_events
    POST /api/visiting_days/:id/composite_events/:id/standalone_events
    POST /api/visiting_days/:id/standalone_events
