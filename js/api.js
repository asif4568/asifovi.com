/**
 * API Client for Portfolio Backend
 * Handles all communication with the backend API
 */

class PortfolioAPI {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Visitor Counter Methods
   */
  
  // Get visitor count
  async getVisitorCount() {
    try {
      const response = await fetch(`${this.baseURL}/visitors`, {
        method: 'GET',
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch visitor count');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting visitor count:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Increment visitor count
  async incrementVisitorCount(isUnique = false) {
    try {
      // Check if this is a new session
      const lastVisit = localStorage.getItem('lastVisit');
      const now = new Date().getTime();
      
      // Consider it a new session if last visit was more than 30 minutes ago or first time
      if (!lastVisit || (now - parseInt(lastVisit)) > 30 * 60 * 1000) {
        // Set this visit time
        localStorage.setItem('lastVisit', now.toString());
        
        // Send API request to increment count
        const response = await fetch(`${this.baseURL}/visitors`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ isUnique })
        });
        
        if (!response.ok) {
          throw new Error('Failed to increment visitor count');
        }
        
        return await response.json();
      }
      
      // If not a new session, just get the current count
      return await this.getVisitorCount();
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Contact Form Methods
   */
  
  // Submit contact form
  async submitContactForm(formData) {
    try {
      const response = await fetch(`${this.baseURL}/contact`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit contact form');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Projects Methods
   */
  
  // Get all projects
  async getProjects(featured = false, limit = 0) {
    try {
      let url = `${this.baseURL}/projects`;
      
      // Add query parameters if needed
      const params = new URLSearchParams();
      if (featured) {
        params.append('featured', 'true');
      }
      if (limit > 0) {
        params.append('limit', limit.toString());
      }
      
      // Append params to URL if any exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting projects:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get single project
  async getProject(id) {
    try {
      const response = await fetch(`${this.baseURL}/projects/${id}`, {
        method: 'GET',
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting project:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const portfolioAPI = new PortfolioAPI(); 