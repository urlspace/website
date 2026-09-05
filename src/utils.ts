const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}
