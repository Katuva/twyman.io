export default () => {
    // moment throws a wobbler with the default datetime format returned,
    // but we always know it'll be a valid datetime returned from the db,
    // so we just force js's date parser to parse it first and bypass the warning.
    return (dateTime) => moment(new Date(dateTime)).fromNow();
}
