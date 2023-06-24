const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.token.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }


    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }

        // Attach the decoded payload to the request object for further use
        req.user = data;

        // Call the next middleware or route handler
        next();
    })
}


const verifyTokenAndAuthorization =  (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({error: "You are not allowed to do that!"})
        }
    })
}

const verifyTokenAndAdmin =  (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({error: "You are not allowed to do that!"})
        }
    })
}



module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
}