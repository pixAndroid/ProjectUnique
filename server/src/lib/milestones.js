/**
 * Returns true if the counter has crossed a 100-multiple milestone
 * when going from `before` to `after`.
 */
function crossedMilestone(before, after) {
  return after > 0 && Math.floor(after / 100) > Math.floor(before / 100);
}

/**
 * Returns the nearest lower 100-multiple for a given value.
 */
function milestone(value) {
  return Math.floor(value / 100) * 100;
}

module.exports = { crossedMilestone, milestone };
