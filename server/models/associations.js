const User = require('./User');
const Course = require('./Course');
const Lesson = require('./Lesson');
const Order = require('./Order');
const Message = require('./Message');
const Payment = require('./Payment');

// Course - Lesson Associations
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'courseLessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - Message Associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Order Associations (if any explicit ones needed beyond simple IDs)
// User.hasMany(Order)...

module.exports = {
    User,
    Course,
    Lesson,
    Order,
    Message,
    Payment
};
