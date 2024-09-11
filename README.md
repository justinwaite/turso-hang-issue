## Setup

### Add a .env file:

```dotenv
# .env
DATABASE_URL=
DATABASE_AUTH_TOKEN=
```

### Install dependencies:

```bash
pnpm i
```

## Running the app

### Locally (non-docker):

```bash
pnpm start
```

### Via Docker:

```bash
docker build ./ -t turso-hang-issue:latest
docker run --env-file .env turso-hang-issue:latest
```

## Issue

At this point, if you run the app then you should have successfully printed out the results of the query.

The app hangs when running in a docker container. This only happens if the version of isomorphic-fetch is locked in
package.json to 0.1.12. If the version is not locked, the app runs fine in a docker container.

To reproduce the issue, add the following in package.json:

```json
"resolutions": {
  "@libsql/isomorphic-fetch": "0.1.12"
}
```

After adding that resolution, run pnpm install, then re-run locally and in a docker container. The app will hang in the
docker container.

Isomorphic-fetch is pinned in my Remix application due to conflicts that occur when using Remix's fetch polyfill. This
occurs even if you have `nativeFetch: true` set in `installGlobals`

## Notes
- This issue occurs when running on an Apple Silicon chip (M1) as well as when deployed on fly.io via the docker 
  container.
- I had to use a workaround in the docker container to avoid an issue where `@libsql/linux-arm64-gnu` wasn't being
  installed automatically. This does not happen in my app, but I found this workaround in Discord.