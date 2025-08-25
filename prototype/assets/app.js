document.addEventListener('DOMContentLoaded', () => {
    const app = {
        // The main content area
        appRoot: document.getElementById('app-root'),
        // Mock data cache
        data: null,

        // Initializes the application
        init: async function() {
            await this.fetchData();
            this.setupEventListeners();
            this.handleRouteChange(); // Initial page load
        },

        // Fetches data from the JSON file
        fetchData: async function() {
            try {
                const response = await fetch('assets/dummy-data.json');
                if (!response.ok) throw new Error('Network response was not ok');
                this.data = await response.json();
            } catch (error) {
                console.error('Failed to fetch data:', error);
                this.appRoot.innerHTML = `<p style="text-align:center;color:red;">Error loading page data. Please try again later.</p>`;
            }
        },

        // Sets up all event listeners
        setupEventListeners: function() {
            // Listen for hash changes to route
            window.addEventListener('hashchange', this.handleRouteChange.bind(this));

            // Handle navigation clicks to prevent full page reload
            document.querySelector('.main-nav').addEventListener('click', (e) => {
                if (e.target.matches('a')) {
                     document.querySelector('.main-nav').classList.remove('active');
                }
            });

            // Mobile navigation toggle
            document.querySelector('.mobile-nav-toggle').addEventListener('click', () => {
                document.querySelector('.main-nav').classList.toggle('active');
            });
        },

        // Main router function
        handleRouteChange: function() {
            const path = window.location.hash || '#home';
            this.appRoot.innerHTML = '<div class="loader"></div>'; // Show loader

            // Update active link style
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === path);
            });

            switch (path) {
                case '#services':
                    this.renderServices();
                    break;
                case '#team':
                    this.renderTeam();
                    break;
                case '#contact':
                    this.renderContact();
                    break;
                case '#home':
                default:
                    this.renderHome();
                    break;
            }
        },

        // --- RENDER FUNCTIONS ---

        renderHome: function() {
            this.appRoot.innerHTML = `
                <section class="hero">
                    <div class="hero-content">
                        <h1>Compassionate Care For Your Best Friend</h1>
                        <p>Your pet's health and happiness are our top priority.</p>
                        <a href="#contact" class="btn">Book an Appointment</a>
                    </div>
                </section>
                <section class="page-section">
                    <div class="container">
                        <h2 class="section-title">Our Promise</h2>
                        <p style="text-align:center; max-width: 800px; margin: 0 auto 2rem auto;">
                            At The Caring Paw, we combine state-of-the-art medical care with a gentle, personal touch. We treat every patient as if they were our own beloved pet.
                        </p>
                    </div>
                </section>
            `;
        },

        renderServices: function() {
            const servicesHtml = this.data.services.map(service => `
                <div class="card">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                </div>
            `).join('');

            this.appRoot.innerHTML = `
                <section class="page-section">
                    <div class="container">
                        <h2 class="section-title">Our Services</h2>
                        <div class="card-grid">
                            ${servicesHtml}
                        </div>
                    </div>
                </section>
            `;
        },

        renderTeam: function() {
            const teamHtml = this.data.team.map(member => `
                <div class="card team-card">
                    <img src="${member.image_url}" alt="${member.name}">
                    <h3>${member.name}</h3>
                    <span class="title">${member.title}</span>
                    <p>${member.bio}</p>
                </div>
            `).join('');

            this.appRoot.innerHTML = `
                <section class="page-section">
                    <div class="container">
                        <h2 class="section-title">Meet Our Team</h2>
                        <div class="card-grid">
                            ${teamHtml}
                        </div>
                    </div>
                </section>
            `;
        },

        renderContact: function() {
            this.appRoot.innerHTML = `
                <section class="page-section">
                    <div class="container">
                        <h2 class="section-title">Contact Us</h2>
                        <p style="text-align:center; margin-bottom: 3rem;">For emergencies, please call us directly at (555) 123-4567. For all other inquiries and appointment requests, please use the form below.</p>
                        <div class="contact-layout">
                            <div class="contact-form">
                                <h3>Request an Appointment</h3>
                                <form id="appointment-form">
                                    <div class="form-group">
                                        <label for="name">Your Name</label>
                                        <input type="text" id="name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="pet-name">Pet's Name</label>
                                        <input type="text" id="pet-name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">Phone Number</label>
                                        <input type="tel" id="phone" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="message">Reason for Visit</label>
                                        <textarea id="message" rows="4" required></textarea>
                                    </div>
                                    <button type="submit" class="btn">Submit Request</button>
                                </form>
                                <div id="form-confirmation">Thank you! Your request has been sent. We will call you back shortly to confirm your appointment.</div>
                            </div>
                            <div class="contact-info">
                                <h3>Clinic Information</h3>
                                <p><strong>Address:</strong><br>123 Pet Lane<br>Animapolis, ST 54321</p>
                                <p><strong>Phone:</strong><br>(555) 123-4567</p>
                                <p><strong>Hours:</strong><br>Mon - Fri: 8am - 6pm<br>Sat: 9am - 1pm<br>Sun: Closed</p>
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.99645233157!2d-122.507640209217!3d37.75767927494483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1675888771485!5m2!1sen!2sus" width="100%" height="250" style="border:0; border-radius: 8px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            `;

            // Add form submission handler after rendering
            const form = document.getElementById('appointment-form');
            const confirmation = document.getElementById('form-confirmation');
            form.addEventListener('submit', e => {
                e.preventDefault();
                form.style.display = 'none';
                confirmation.style.display = 'block';
            });
        }
    };

    app.init();
});