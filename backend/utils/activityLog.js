const MAX_EVENTS = 100;
const events = [];

export const logActivity = (type, message, meta = {}) => {
    events.unshift({
        type,
        message,
        meta,
        timestamp: new Date().toISOString()
    });
    if (events.length > MAX_EVENTS) events.pop();
};

export const getRecentActivity = (limit = 20) => events.slice(0, limit);
