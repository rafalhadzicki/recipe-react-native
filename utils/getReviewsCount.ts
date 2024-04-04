export const getReviewsCount = (ratingCount: number) => {
  if (ratingCount >= 1000000) {
    return `${(ratingCount / 1000000).toFixed(1)}m`;
  } else if (ratingCount >= 1000) {
    return `${(ratingCount / 1000).toFixed(1)}k`;
  }
  return ratingCount;
};
