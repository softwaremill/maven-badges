# Badges for Maven projects

A node.js implementation of [maven-badges](https://github.com/jirutka/maven-badges), originally created in Ruby. We've migrated this project to node.js for maintainability reasons.

## Description

Badges! These tiny pictures with label and some numbers, you see them in many GitHub readmes. We all love them, yeah? Travis, Coveralls, Code Climate, Gemnasium, Gem, PyPi, npm… 
However, most of them are not usable for Java/Groovy guys and that’s quite sad, isn’t it?

## Usage

```
https://maven-badges.herokuapp.com/maven-central/{group_id}/{artifact_id}/badge.(svg|png)?style={style}
```

For example:

```
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg)](https://maven-badges.herokuapp.com/maven-central/cz.jirutka.rsql/rsql-parser)
```

[![Maven Central](https://maven-badges.herokuapp.com/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg)](https://maven-badges.herokuapp.com/maven-central/cz.jirutka.rsql/rsql-parser)

```
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg?style=plastic)](https://maven-badges.herokuapp.com/maven-central/cz.jirutka.rsql/rsql-parser)
```

[![Maven Central](https://maven-badges.herokuapp.com/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg?style=plastic)](https://maven-badges.herokuapp.com/maven-central/cz.jirutka.rsql/rsql-parser)

## Development

You will need a running redis instance - use docker: `docker run -p 6379:6379 --name maven-badge-redis -d redis`

Start the TypeScript compiler in watch mode: `npm run tsc:watch`

Start the application: `npm run serve`

To run the tests suite, simply run `npm test`

## License

This project is licensed under [Apache 2.0 license]( http://www.apache.org/licenses/LICENSE-2.0).
