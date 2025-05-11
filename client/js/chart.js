// Applications Status Chart (Pie/Doughnut)
function createApplicationsChart(stats) {
  const ctx = document.getElementById('applicationsChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [{
        data: [stats.approved, stats.pending, stats.rejected],
        backgroundColor: [
          '#4bb543', // green for approved
          '#f0ad4e', // yellow for pending
          '#d9534f'  // red for rejected
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.raw;
              const percentage = Math.round((value / total) * 100);
              label += `${value} (${percentage}%)`;
              return label;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
}

// Loan Amounts Chart (Bar)
function createLoanAmountsChart(applications) {
  const ctx = document.getElementById('loanAmountsChart').getContext('2d');
  
  // Get last 5 applications for the chart
  const recentApps = applications.slice(-5).reverse();
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: recentApps.map(app => app.name),
      datasets: [{
        label: 'Loan Amount ($)',
        data: recentApps.map(app => app.loan_amount),
        backgroundColor: '#4361ee',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          },
          ticks: {
            callback: function(value) {
              return '$' + value;
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}