export const CheckSuper = (req, res, next) => {
    const { role } = req.users;

    if (role !== 1) {
        return res.send({ messager: 'User not right' })
    }

    next();
}

export const CheckUserAdmin = (req, res, next) => {
    const { role } = req.users;

    if (role > 3) {
        return res.send({ messager: 'User not right' })
    }

    next();
}