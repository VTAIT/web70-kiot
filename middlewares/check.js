export const CheckSuper = (req, res, next) => {
    const { role } = req.users;

    if (role !== 1) {
        return res.send({ messager: 'User not right' })
    }

    next();
}

export const CheckUserAdmin = (req, res, next) => {
    const { role } = req.users;

    if (role > 2) {
        return res.send({ messager: 'User not right' })
    }

    next();
}

export const CheckRoleAccount = (req, res, next) => {
    const { role } = req.users;

    if (![1, 2].includes(role)) {
        return res.send({ messager: 'User not right' })
    }
    next();
}