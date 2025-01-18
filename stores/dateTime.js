export const useDateTimeStore = defineStore("dateTime", () => {
  const daysCount = ref(0);
  const bookingPeople = ref(1);

  const formatDate = (date) => {
    const offsetToUTC8 = date.getHours() + 8;
    date.setHours(offsetToUTC8);
    return date.toISOString().split("T")[0];
  };
  const currentDate = new Date();

  const bookingDate = reactive({
    date: {
      start: formatDate(currentDate),
      end: null,
    },
    minDate: new Date(),
    maxDate: new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)),
  });

  const handleDateChange = (bookingInfo) => {
    const { start, end } = bookingInfo.date;
    bookingDate.date.start = start;
    bookingDate.date.end = end;

    bookingPeople.value = bookingInfo?.people || 1;
    daysCount.value = bookingInfo.daysCount;
  };
  return {
    daysCount,
    bookingPeople,
    bookingDate,
    handleDateChange,
    formatDate,
  };
});
