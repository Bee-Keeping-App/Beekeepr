export default (controller) => {
    return (req, res, next) => {
        // If the async function throws an error, .catch(next) 
        // automatically sends it to your error middleware
        Promise.resolve(controller(req, res, next)).catch(next);
    };
};