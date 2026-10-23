export const clamp = (v: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, v));

export const smoothstep = (e0: number, e1: number, v: number): number => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const segmentInOut = (
  s: number,
  a: number,
  b: number,
  c: number,
  d: number
) => {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
};

export const normalizeSightIndex = (
  activeSight: number,
  originalSightCount: number
): number => {
  if (!originalSightCount) return activeSight;
  if (activeSight >= originalSightCount * 2) {
    return activeSight - originalSightCount;
  }
  if (activeSight < originalSightCount) {
    return activeSight + originalSightCount;
  }
  return activeSight;
};

export const computeScrollState = (smoothScroll: number, innerHeight = 900) => {
  const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
  const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
  const progress = clamp(smoothScroll / 2700);
  const introExit = smoothstep(90, 650, smoothScroll);
  const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll);
  const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
  const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);
  const blurActive = clamp(frame2.active + frame3.active);
  const frame2Opacity = frame2.active * (1 - frame3.enter);
  const splitDrift = Math.pow(frame2.enter, 1.5);
  const panel2Opacity = frame2.active * (1 - frame2.exit);
  const panel3Opacity = frame3.active * (1 - frame3.exit);
  const backScale =
    0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
  const sharedHeroY = progress * -74;
  const sharedHeroScale = progress * 0.23;
  const sightsScreenTop =
    Math.min(220, Math.max(112, innerHeight * 0.19)) - 50;
  const sightsParentTop =
    innerHeight - (innerHeight - sightsScreenTop) / backScale;

  return {
    frame2,
    frame3,
    progress,
    introExit,
    sightsEnter,
    sightsControlsEnter,
    blurActive,
    frame2Opacity,
    splitDrift,
    panel2Opacity,
    panel3Opacity,
    backScale,
    sharedHeroY,
    sharedHeroScale,
    sightsScreenTop,
    sightsParentTop,
  };
};
