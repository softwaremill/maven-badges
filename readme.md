# Badges for Maven projects

[![CI](https://github.com/softwaremill/maven-badges/actions/workflows/ci.yml/badge.svg)](https://github.com/softwaremill/maven-badges/actions/workflows/ci.yml)

A node.js implementation of [maven-badges](https://github.com/jirutka/maven-badges), originally created in Ruby. 
We've migrated this project to node.js for maintainability reasons.

## Description

Badges! These tiny pictures with label and some numbers, you see them in many GitHub readmes. We all love them, yeah? 
Travis, Coveralls, Code Climate, Gemnasium, Gem, PyPi, npm…
However, most of them are not usable for Java/Groovy guys and that’s quite sad, isn’t it?

## A new DNS address

We migrated the service into our kubernetes cluster as we would like to close the Heroku instance at the end of this year 2025.
Please use a new url from now on, also the existing Heroku instance is going to redirect to the new DNS address.

> NOTE: the old url is going to be available until the end of this year 2025.

Please use
```
https://maven-badges.sml.io
```

instead of deprecated

```
https://maven-badges.herokuapp.com
```

## Usage

```
https://maven-badges.sml.io/{repository}/{group_id}/{artifact_id}/badge.(svg|png)?style={style}
```

where `repository` is one of:
 - `maven-central` points to https://search.maven.org/
 - `sonatype-central` points to https://central.sonatype.com/

use repository where your artifact is published to.

where `style` can be one of:
 - `plastic`
 - `flat`
 - `flat-square`
 - `for-the-badge`
 - `social`

check [Styles](https://shields.io/#styles) section at [shields.io](https://shields.io/).

### No semver versions

You can try to use `gav=true` parameter to bypass semver problem - when some artifacts are following semver pattern,
and some don't, in such case try to use `gav`:

```
https://maven-badges.sml.io/maven-central/{group_id}/{artifact_id}/badge.(svg|png)?style={style}&gav=true
```

### Hardcode version

You can also specify exact version to show on badge, just use `?version=x.x.x` as  follow:
```
https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg?version=2.0.0
```

### Examples

```
[![Maven Central](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg)](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser)
```

[![Maven Central](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg)](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser)

```
[![Maven Central](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg?style=plastic)](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser)
```

[![Maven Central](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg?style=plastic)](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser)

```
[![Maven Central](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg=version=2.0.0)](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser)
```

[![Maven Central](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser/badge.svg?version=2.0.0)](https://maven-badges.sml.io/maven-central/cz.jirutka.rsql/rsql-parser)

## Development

You will need a running redis instance - use docker: `docker run -p 6379:6379 --name maven-badge-redis -d redis`

Start the TypeScript compiler in watch mode: `npm run tsc:watch`

Start the application: `npm run serve`

To run the tests suite, simply run `npm test`

## License

This project is licensed under [Apache 2.0 license]( http://www.apache.org/licenses/LICENSE-2.0).
