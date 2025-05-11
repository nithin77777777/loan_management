const db = require('../config/db');

class Application {
  static async create({ name, email, phone, loan_amount, purpose }) {
    // Implementation here
  }

  static async getAll() {
    // Implementation here
    return [];
  }

  static async getStats() {
    // Implementation here
    return {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      avgLoan: 0
    };
  }
}

module.exports = Application;