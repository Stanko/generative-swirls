function cut(start, end, ratio) {
  const r1 = {
    x: start.x * (1 - ratio) + end.x * ratio,
    y: start.y * (1 - ratio) + end.y * ratio,
  };
  const r2 = {
    x: start.x * ratio + end.x * (1 - ratio),
    y: start.y * ratio + end.y * (1 - ratio),
  };
  return [r1, r2];
}

export function chaikin(curve, iterations = 1, closed = false, ratio = 0.25) {
  if (iterations < 1) {
    return curve;
  }

  if (ratio > 0.5) {
    ratio = 1 - ratio;
  }

  for (let i = 0; i < iterations; i++) {
    let refined = [];
    refined.push(curve[0]);

    for (let j = 1; j < curve.length; j++) {
      let points = cut(curve[j - 1], curve[j], ratio);
      refined = refined.concat(points);
    }

    if (closed) {
      refined.shift();
      refined = refined.concat(cut(curve[curve.length - 1], curve[0], ratio));
    } else {
      refined.push(curve[curve.length - 1]);
    }

    curve = refined;
  }
  return curve;
}
