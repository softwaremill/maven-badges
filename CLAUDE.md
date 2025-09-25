# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Maven-Badges Project Rules

## Testing
- ALWAYS run `npm test` after making any code changes
- All tests must pass before considering work complete
- When making changes to API logic, update corresponding test mocks to match
- Pay special attention to URL patterns in test mocks - they must exactly match the actual requests

## Code Changes
- When modifying `solrsearch.ts`, ensure test mocks in both `maven-http.spec.ts` and `sonatype-http.spec.ts` are updated consistently
- Maven Central and Sonatype Central have different API behaviors - verify changes work for both repositories
- When changing URL parameters (like `&rows=1`), update ALL related test mocks
- The `ComparableVersion` class handles Maven semantic versioning - be careful with version comparison logic

## File Naming Conventions
- Use kebab-case for file names (e.g., `comparable-version.ts`, not `ComparableVersion.ts`)
- Avoid CamelCase in file names to maintain consistency across the project

## Build Process
- Run `npm run build` before running tests (handled automatically by `npm test`)
- The project uses TypeScript - ensure all type definitions are correct
- Check that compiled JavaScript in `/dist` reflects your changes

## API Consistency
- Maven Central and Sonatype Central endpoints should behave consistently
- Version sorting must follow Maven's semantic versioning rules
- Handle both single and multiple version results correctly
- Ensure proper error handling for non-existent artifacts

## Common Issues to Watch For
- URL parameter mismatches between actual code and test mocks
- Content-Type header issues when version lookup fails
- Redirect URL generation for different repository types

## Debugging
- Check server logs for `[info] solr-search:` messages to verify API calls
- Look for `Sorted:` log messages to confirm version sorting is working
- Test failures often indicate mock URL mismatches with actual requests

## Technical Specifications

### Architecture
- **Framework**: Express.js with TypeScript
- **Testing**: Mocha + Chai + Supertest with axios-mock-adapter
- **Cache**: Redis for badge caching
- **Build**: TypeScript compiler (tsc)

### Error Handling
- **404 responses**: Return `NotFoundError` for non-existent artifacts
- **Version lookup failures**: Must not cause Content-Type header issues
- **Redirect fallbacks**: Use search URLs when artifact details unavailable

### Critical Rules
1. **ALWAYS** keep test mock URLs synchronized with actual request URLs
2. **VERIFY** both repositories work when making changes to version logic
3. **ENSURE** ComparableVersion sorting is consistent with Maven's rules
4. **TEST** that Content-Type headers are properly set for all responses

## Development Commands

### Common Commands
- `npm test` - Run all tests (automatically builds first)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Run TypeScript compiler in watch mode
- `npm run serve` - Start development server with nodemon
- `npm start` - Start production server

### Development Setup
- Requires Redis instance: `docker run -p 6379:6379 --name maven-badge-redis -d redis`
- Use `npm run watch` and `npm run serve` in separate terminals for development

### Development Workflow
1. Make code changes
2. Run `npm test` to verify all tests pass
3. Check logs for proper API calls and version sorting
4. Verify both Maven Central and Sonatype Central functionality
5. Ensure no Content-Type or redirect issues remain

## Project Structure

### Key Files
- `src/main.ts` - Application entry point with Redis setup
- `src/server.ts` - Express server setup with route handlers for both repositories
- `src/services/solrsearch.ts` - Core logic for Maven/Sonatype API integration
- `src/services/shields.ts` - Badge generation via shields.io
- `src/version/comparable-version.ts` - Maven semantic versioning implementation
- `src/middleware.ts` - Request validation and redirect handling

### Repository Support
- **Maven Central**: `/maven-central` endpoints using search.maven.org
- **Sonatype Central**: `/sonatype-central` endpoints using central.sonatype.com
- Both repositories share common badge generation logic but have different API behaviors