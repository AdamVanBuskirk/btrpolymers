export const formatDollars = (num: number): string => {
    if (isNaN(num)) return "$0";
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(0)}K`;
    } else {
      return `$${num.toFixed(0)}`;
    }
  }
  