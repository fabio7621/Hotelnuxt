export const useBookingStore = defineStore("booking", () => {
  const bookingResult = ref({});

  const createBooking = (reservationInfo) => {
    bookingResult.value = {
      ...reservationInfo,
    };
  };

  const clearBooking = () => {
    bookingResult.value = {};
  };

  return {
    bookingResult,
    createBooking,
    clearBooking,
  };
});
