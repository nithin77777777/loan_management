// main.js
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle sections
            document.querySelectorAll('section').forEach(s => s.style.display = 'none');
            document.querySelector(this.getAttribute('href')).style.display = 'block';
            
            if(this.hash === '#dashboard') loadDashboard();
        });
    });

    // Form Submission
    document.getElementById('loanForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        
        try {
            btn.disabled = true;
            
            // Form data validation
            const formData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                loan_amount: parseFloat(form.loan_amount.value),
                purpose: form.purpose.value
            };

            // API call
            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (!response.ok) throw new Error(result.error || 'Submission failed');
            
            // Reset form and reload stats
            form.reset();
            loadDashboard();
            document.querySelector('[href="#dashboard"]').click();

        } catch (error) {
            alert(error.message);
        } finally {
            btn.disabled = false;
        }
    });

    // Initialize dashboard
    loadDashboard();
});

async function loadDashboard() {
    try {
        // Load stats
        const statsResponse = await fetch('http://localhost:5000/api/stats');
        const stats = await statsResponse.json();
        
        // Update stats grid
        const statsGrid = document.querySelector('.stats-grid');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <h3>Total Applications</h3>
                <p>${stats.total}</p>
            </div>
            <div class="stat-card">
                <h3>Approved</h3>
                <p>${stats.approved}</p>
            </div>
            <div class="stat-card">
                <h3>Pending</h3>
                <p>${stats.pending}</p>
            </div>
            <div class="stat-card">
                <h3>Rejected</h3>
                <p>${stats.rejected}</p>
            </div>
            <div class="stat-card">
                <h3>Average Loan</h3>
                <p>$${stats.avgLoan.toFixed(2)}</p>
            </div>
        `;

        // Initialize chart
        const ctx = document.getElementById('applicationsChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Approved', 'Pending', 'Rejected'],
                datasets: [{
                    data: [stats.approved, stats.pending, stats.rejected],
                    backgroundColor: ['#4BB543', '#F0AD4E', '#D9534F']
                }]
            }
        });

    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}