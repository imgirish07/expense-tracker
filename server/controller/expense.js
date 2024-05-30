const Expense = require('../models/Expense');
const User = require('../models/User');
const Contact = require('../models/Contact');

const GetUserFromCookies = require('../service/Get_User_from_cookies');

// // function to handle date and time. Required to push into historyArray
// async function addTimestamp() {

//     const currentDate = new Date();

//     const hours = currentDate.getHours();
//     const minutes = currentDate.getMinutes();
//     const seconds = currentDate.getSeconds();
//     const date = currentDate.getDate();
//     const month = currentDate.getMonth() + 1; // January is 0, so we add 1
//     const year = currentDate.getFullYear();

//     // Format the timestamp as desired
//     const timestamp = `${hours}:${minutes}:${seconds} - ${date}/${month}/${year}`;
//     return timestamp;
// }

async function handleExpense(req, res) {
    // get data from user
    const Amount = parseInt(req.body.Amount);
    const { Description, Category, contactId } = req.body;

    // check all the fields are entered
    if (!(Amount && Description && Category)) {
        return res.status(400).json({ message: 'Enter all the fields' });
    }

    // calling addTimeStamp to get time
    // const Time = await addTimestamp();

    const expense = await Expense.create({
        Amount,
        Description,
        Category,
    });
    const fetchUser =await GetUserFromCookies(req, res);
    const user = await User.findById(fetchUser._id);
    await user.expenses.push(expense._id);
    await user.save();

    // if i have given this contactId then i want to push the expense to both contact and the user because this is the expense of the contact that the user paid
    if (contactId) {
        const contact = await Contact.findById(contactId);
        await contact.expenses.push(expense._id);
        await contact.save();
    }

    return res.status(200).json({ message: "expense created successfully", expense });
}

module.exports = handleExpense;
