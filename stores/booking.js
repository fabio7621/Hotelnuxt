export const useBookingStore = defineStore("booking", () => {
  const bookingResult = ref({});

  const createBooking = (reservationInfos) => {
    bookingResult.value = reservationInfos;
  };

  return {
    bookingResult,
    createBooking,
  };
});
