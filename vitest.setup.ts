import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/server";

class MockResizeObserver {
  private callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            x: 0,
            y: 0,
            width: 1024,
            height: 800,
            top: 0,
            left: 0,
            right: 1024,
            bottom: 800,
            toJSON: () => "",
          } as DOMRectReadOnly,
          borderBoxSize: [{ blockSize: 800, inlineSize: 1024 }],
          contentBoxSize: [{ blockSize: 800, inlineSize: 1024 }],
          devicePixelContentBoxSize: [],
        },
      ],
      this as unknown as ResizeObserver,
    );
  }
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = MockResizeObserver;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
