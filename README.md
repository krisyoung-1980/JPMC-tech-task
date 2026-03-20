# Financial Instruments

A React application that fetches and displays a sortable table of financial instruments (equities, macro, and credit) from a REST API.

## Stack

- React 19, TypeScript, Vite
- Vitest + Testing Library for tests
- MSW for API mocking

## Running

```bash
npm install
npm run dev
```

## Commands

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start dev server                    |
| `npm run build`      | Type-check and build for production |
| `npm test`           | Run tests once                      |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run typecheck`  | Type-check without building         |
| `npm run lint`       | Lint                                |
| `npm run format`     | Format source files                 |

## Usage

### Sorting

Click any sortable column header to cycle through sort states. Each column defines its own cycle order:

| Column      | Default  | Cycle                 |
| ----------- | -------- | --------------------- |
| Ticker      | unsorted | asc → desc → unsorted |
| Asset Class | asc      | asc → desc → unsorted |
| Price       | unsorted | desc → asc → unsorted |

#### Multi-column sort

Hold **Shift** and click a second column header to add it as a secondary sort. Priority order is shown numerically on each active header (e.g. `1▲`, `2▼`). A plain click (without Shift) resets to single-column sort.

### Virtualisation

Row windowing is handled by [`@tanstack/react-virtual`](https://tanstack.com/virtual). Only the rows visible within the scroll container are rendered to the DOM — the remaining rows are represented by two spacer `<tr>` elements (above and below) that keep the scrollbar proportion accurate.

The scroll container fills the remaining viewport height via flexbox. `@tanstack/react-virtual` observes the container with `ResizeObserver` internally, so the visible row count adjusts automatically on window resize.

***Note: The spec specifically forbade the use of a table rendering library, but it wasn't clear if it was ok to use supporting libraries such as the above. If for any reason it's not ok then simply revert to the initial commit which has no virtualisation applied.***
