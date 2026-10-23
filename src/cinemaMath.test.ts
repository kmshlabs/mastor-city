import test from "node:test";
import assert from "node:assert/strict";
import {
  clamp,
  smoothstep,
  lerp,
  segmentInOut,
  normalizeSightIndex,
  computeScrollState,
} from "./cinemaMath";

test("clamp bounds values correctly", () => {
  assert.equal(clamp(-5), 0);
  assert.equal(clamp(0.4), 0.4);
  assert.equal(clamp(2.5), 1);
  assert.equal(clamp(150, 100, 200), 150);
});

test("smoothstep interpolates Hermite curve", () => {
  assert.equal(smoothstep(0, 100, 0), 0);
  assert.equal(smoothstep(0, 100, 50), 0.5);
  assert.equal(smoothstep(0, 100, 100), 1);
});

test("lerp interpolates linearly", () => {
  assert.equal(lerp(10, 20, 0.5), 15);
});

test("segmentInOut computes enter, exit, and active phases", () => {
  const before = segmentInOut(400, 560, 900, 1300, 1620);
  assert.equal(before.enter, 0);
  assert.equal(before.exit, 0);
  assert.equal(before.active, 0);

  const mid = segmentInOut(1100, 560, 900, 1300, 1620);
  assert.equal(mid.enter, 1);
  assert.equal(mid.exit, 0);
  assert.equal(mid.active, 1);

  const after = segmentInOut(1700, 560, 900, 1300, 1620);
  assert.equal(after.enter, 1);
  assert.equal(after.exit, 1);
  assert.equal(after.active, 0);
});

test("computeScrollState matches choreography acceptance criteria", () => {
  const start = computeScrollState(0, 900);
  assert.equal(start.introExit, 0);
  assert.equal(start.backScale, 0.76);
  assert.equal(start.sightsEnter, 0);

  const frame2Peak = computeScrollState(1100, 900);
  assert.equal(frame2Peak.introExit, 1);
  assert.equal(frame2Peak.frame2.active, 1);
  assert.equal(frame2Peak.panel2Opacity, 1);
  assert.equal(frame2Peak.blurActive, 1);

  const frame3Peak = computeScrollState(2300, 900);
  assert.equal(frame3Peak.frame3.active, 1);
  assert.equal(frame3Peak.panel3Opacity, 1);

  const end = computeScrollState(3700, 900);
  assert.equal(end.sightsEnter, 1);
  assert.equal(end.sightsControlsEnter, 1);
  assert.ok(Math.abs(end.backScale - 1.3) < 1e-6);
});

test("normalizeSightIndex wraps indices into middle clone set [5..9]", () => {
  assert.equal(normalizeSightIndex(10, 5), 5);
  assert.equal(normalizeSightIndex(12, 5), 7);
  assert.equal(normalizeSightIndex(4, 5), 9);
  assert.equal(normalizeSightIndex(7, 5), 7);
});
