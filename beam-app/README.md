# Beam App

Previously known as "Chain Tools", this application allows end-users to interact with their Beam wallet by swapping, bridging, transferring and viewing their tokens.

## Requirements

- Node >=20
- pnpm >=9

## Setup

- Copy `.env.example` into `.env` and enter the correct values
- `pnpm i`: Install the dependencies
- `pnpm dev`: Run the development server

## Available Scripts

| Command            | Description                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`              | Runs the development server with hot-reloading                                                                                                                      |
| `build`            | Compiles the application                                                                                                                                            |
| `start`            | Serves the compiled application on port 3000                                                                                                                        |
| `validate:fix:all` | Uses Biomejs to validate the application code and fixes issues where possible                                                                                       |
| `generate:barrels` | Generates barrel files within the folders specified in `~/barrelsby.json`. Whenever you add a new component or helper function, it's recommended to run this script |
| `test:types`       | Valides TypeScript types throughout the project                                                                                                                     |
| `test:e2e`         | Runs the Playwright E2E tests                                                                                                                                       |
