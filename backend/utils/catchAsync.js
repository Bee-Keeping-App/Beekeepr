export default fn => {
    return (req, res, next) => {
        // If the async function throws an error, .catch(next) 
        // automatically sends it to your error middleware
        fn(req, res, next).catch(next);
    };
};