export const useDateTimeStore = defineStore("dateTime", () => {
  const DEFAULT_BOOKING_PEOPLE = 1;
  const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

  const daysCount = ref(0);
  const bookingPeople = ref(DEFAULT_BOOKING_PEOPLE);

  const formatDate = (date) => {
    const targetDate = new Date(date);
    const offsetToUTC8 = targetDate.getHours() + 8;
    targetDate.setHours(offsetToUTC8);
    return targetDate.toISOString().split("T")[0];
  };

  const calculateDaysBetween = (start, end) => {
    if (!start || !end) {
      return 0;
    }

    const diffInMilliseconds = Math.abs(new Date(end) - new Date(start));
    return Math.floor(diffInMilliseconds / MILLISECONDS_IN_A_DAY);
  };

  const today = new Date();

  const bookingDate = reactive({
    date: {
      start: formatDate(today),
      end: null,
    },
    minDate: new Date(),
    maxDate: new Date(new Date(today).setFullYear(today.getFullYear() + 1)),
  });

  const handleDateChange = (bookingInfo = {}) => {
    const { start, end } = bookingInfo?.date || {};
    const selectedPeople = unref(bookingInfo?.people);
    const selectedDaysCount = unref(bookingInfo?.daysCount);

    bookingDate.date.start = start;
    bookingDate.date.end = end;

    bookingPeople.value = selectedPeople || DEFAULT_BOOKING_PEOPLE;
    daysCount.value = selectedDaysCount ?? calculateDaysBetween(start, end);
  };

  const clearBookingDate = () => {
    bookingDate.date.start = formatDate(new Date());
    bookingDate.date.end = null;
    bookingPeople.value = DEFAULT_BOOKING_PEOPLE;
    daysCount.value = 0;
  };

  return {
    daysCount,
    bookingPeople,
    bookingDate,
    handleDateChange,
    clearBookingDate,
    calculateDaysBetween,
    formatDate,
  };
});
