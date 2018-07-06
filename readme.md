# Badges for Maven projects

A node.js implementation of [maven-badges](https://github.com/jirutka/maven-badges), originally created in Ruby. We migrated this project to NodeJS as this will allow us support it and fix isseues a way better.

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

## License

This project is licensed under [MIT license](http://opensource.org/licenses/MIT).
