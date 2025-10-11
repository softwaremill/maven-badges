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
https://maven-badges.sml.io/{repository}/{group_id}/{artifact_id}/badge.(svg|png)?style={style}&subject={label}&color={color}
```

where `repository` is one of:
 - `maven-central` points to https://search.maven.org/
 - `sonatype-central` points to https://central.sonatype.com/

use repository where your artifact is published to.

### Query Parameters

All query parameters are optional:

- **`style`** - Badge style, can be one of:
  - `plastic`
  - `flat` (default)
  - `flat-square`
  - `for-the-badge`
  - `social`
  
  Check [Styles](https://shields.io/#styles) section at [shields.io](https://shields.io/).

- **`subject`** - Custom label text for the badge
  - Default: `"maven central"` or `"sonatype central"` (based on repository)
  - Example: `?subject=My%20Library`

- **`color`** - Badge color
  - Default: `brightgreen`
  - Can be any valid shields.io color (e.g., `blue`, `red`, `orange`, `yellow`, `green`, etc.)
  - Example: `?color=blue`

- **`version`** - Hardcode a specific version to display (see [Hardcode version](#hardcode-version) below)

- **`gav`** - Use GAV search mode to bypass semver issues (see [No semver versions](#no-semver-versions) below)

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

**Default badge:**
```
[![Sonatype Central](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)
```

[![Sonatype Central](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)

**Custom style:**
```
[![Sonatype Central](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg?style=plastic)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)
```

[![Sonatype Central](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg?style=plastic)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)

**Hardcoded version:**
```
[![Sonatype Central](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg?version=0.0.1)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)
```

[![Sonatype Central](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg?version=0.0.1)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)

**Custom label:**
```
[![STTP AI](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg?subject=sttp%20ai)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)
```

[![STTP AI](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg?subject=sttp%20ai)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)

**Custom label and color:**
```
[![Latest Release](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg?subject=Latest%20Release&color=blue)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)
```

[![Latest Release](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/badge.svg?subject=Latest%20Release&color=blue)](https://maven-badges.sml.io/sonatype-central/com.softwaremill.sttp.ai/core_3/)

## Development

You will need a running redis instance - use docker: `docker run -p 6379:6379 --name maven-badge-redis -d redis`

Start the TypeScript compiler in watch mode: `npm run tsc:watch`

Start the application: `npm run serve`

To run the tests suite, simply run `npm test`

## License

This project is licensed under [Apache 2.0 license]( http://www.apache.org/licenses/LICENSE-2.0).
