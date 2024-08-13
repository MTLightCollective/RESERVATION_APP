import LoginModal from './login-modal.js';
import SignupModal from './signup-modal.js';
import BookingModal from './booking-modal.js';

new Vue({
    el: '#app',
    components: {
        'login-modal': LoginModal,
        'signup-modal': SignupModal,
        'booking-modal': BookingModal
    },
    data: {
        currentUser: null,
        showLoginModal: false,
        showSignupModal: false,
        showBookingModal: false,
        startDate: null,
        endDate: null,
        currentYear: new Date().getFullYear(),
        bookings: []
    },
    computed: {
        formattedDateRange() {
            if (this.startDate && this.endDate) {
                return `${this.formatDate(this.startDate)} to ${this.formatDate(this.endDate)}`;
            } else if (this.startDate) {
                return this.formatDate(this.startDate);
            }
            return '';
        }
    },
    methods: {
        formatDate(date) {
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        },
        getMonthName(monthIndex) {
            return new Date(this.currentYear, monthIndex).toLocaleString('default', { month: 'long' });
        },
        getMonthDays(month) {
            const firstDay = new Date(this.currentYear, month - 1, 1);
            const lastDay = new Date(this.currentYear, month, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();

            let days = [];
            for (let i = 0; i < startingDayOfWeek; i++) {
                days.push({ day: 0, date: null });
            }
            for (let i = 1; i <= daysInMonth; i++) {
                days.push({ day: i, date: new Date(this.currentYear, month - 1, i) });
            }
            return days;
        },
        isBookedDay(date) {
            if (!date) return false;
            return this.bookings.some(booking => 
                date >= new Date(booking.start) && date <= new Date(booking.end)
            );
        },
        getBookingUser(date) {
            if (!date) return '';
            const booking = this.bookings.find(booking => 
                date >= new Date(booking.start) && date <= new Date(booking.end)
            );
            return booking ? booking.user : '';
        },
        isSelectedDay(date) {
            return date && (
                (this.startDate && date.getTime() === this.startDate.getTime()) ||
                (this.endDate && date.getTime() === this.endDate.getTime())
            );
        },
        isInRange(date) {
            return date && this.startDate && this.endDate &&
                   date > this.startDate && date < this.endDate;
        },
        selectDate(date) {
            if (!date || this.isBookedDay(date)) return;
            
            if (this.currentUser) {
                if (!this.startDate || (this.startDate && this.endDate)) {
                    this.startDate = date;
                    this.endDate = null;
                } else if (date > this.startDate) {
                    this.endDate = date;
                    this.showBookingModal = true;
                } else {
                    this.startDate = date;
                    this.endDate = null;
                }
            } else {
                this.showLoginModal = true;
            }
        },
        login(email, password) {
            // Simulated login logic
            this.currentUser = { name: 'John Doe', email: email };
            this.showLoginModal = false;
        },
        signup(name, email, password) {
            // Simulated signup logic
            this.currentUser = { name: name, email: email };
            this.showSignupModal = false;
        },
        logout() {
            this.currentUser = null;
            this.startDate = null;
            this.endDate = null;
        },
        bookApartment() {
            // Simulated booking logic
            this.bookings.push({
                start: this.startDate,
                end: this.endDate,
                user: this.currentUser.name
            });
            this.showBookingModal = false;
            this.startDate = null;
            this.endDate = null;
        },
        cancelBooking() {
            this.showBookingModal = false;
            this.startDate = null;
            this.endDate = null;
        },
        updateCalendar() {
            // This method is called when the year input changes
        }
    },
    mounted() {
        // Simulated initial bookings
        this.bookings = [
            { start: new Date(this.currentYear, 0, 10), end: new Date(this.currentYear, 0, 15), user: 'Alice' },
            { start: new Date(this.currentYear, 1, 5), end: new Date(this.currentYear, 1, 10), user: 'Bob' },
            { start: new Date(this.currentYear, 2, 20), end: new Date(this.currentYear, 2, 25), user: 'Charlie' },
        ];
    }
});
