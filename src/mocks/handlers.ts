import { http, HttpResponse } from "msw";
import { instruments } from "./data";

export const handlers = [
  http.get("/api/instruments", () => {
    const latency = 300 * Math.random() + 200;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(instruments));
      }, latency);
    });
  }),
];
