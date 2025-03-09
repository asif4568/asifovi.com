const Visitor = require('../models/Visitor');

// Get visitor count
exports.getVisitorCount = async (req, res) => {
  try {
    let visitorData = await Visitor.findOne();
    
    if (!visitorData) {
      visitorData = await Visitor.create({ count: 0, uniqueVisitors: 0 });
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalVisits: visitorData.count,
        uniqueVisitors: visitorData.uniqueVisitors
      }
    });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Increment visitor count
exports.incrementVisitorCount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let visitorData = await Visitor.findOne();
    
    if (!visitorData) {
      visitorData = await Visitor.create({
        count: 1,
        uniqueVisitors: 1,
        dailyVisits: [{ date: today, count: 1 }]
      });
    } else {
      // Check if we have a record for today
      const todayRecord = visitorData.dailyVisits.find(
        visit => new Date(visit.date).toDateString() === today.toDateString()
      );
      
      if (todayRecord) {
        // Update today's count
        todayRecord.count += 1;
      } else {
        // Add a new record for today
        visitorData.dailyVisits.push({ date: today, count: 1 });
      }
      
      // Increment total count
      visitorData.count += 1;
      
      // If this is a unique visitor (would be determined by client-side cookie or IP)
      if (req.body.isUnique) {
        visitorData.uniqueVisitors += 1;
      }
      
      await visitorData.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalVisits: visitorData.count,
        uniqueVisitors: visitorData.uniqueVisitors
      }
    });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get visitor statistics
exports.getVisitorStats = async (req, res) => {
  try {
    const visitorData = await Visitor.findOne();
    
    if (!visitorData) {
      return res.status(404).json({
        success: false,
        error: 'No visitor data found'
      });
    }
    
    // Get daily visits for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentVisits = visitorData.dailyVisits.filter(
      visit => new Date(visit.date) >= thirtyDaysAgo
    );
    
    res.status(200).json({
      success: true,
      data: {
        totalVisits: visitorData.count,
        uniqueVisitors: visitorData.uniqueVisitors,
        recentVisits
      }
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 