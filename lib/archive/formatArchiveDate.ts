export function formatArchiveDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
      .format(new Date(date))
      .toUpperCase();
  }