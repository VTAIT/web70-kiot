import { RESPONSE } from "../globals/api.js";
import { Fields } from "../globals/fields.js";
import { saleoff_create, saleoff_getAll, saleoff_getAllByKiot, saleoff_getById, saleoff_getByName, saleoff_updateById } from "../services/mongo/saleoff.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let saleOffProductList = [];
    let saleOffTransactionList = [];

    try {
        // supper admin
        if (role === 1) {
            const saleOffFromDb = await saleoff_getAll();
            saleOffFromDb.forEach(e => {
                const type = e.type;
                if (type === 1) {
                    saleOffProductList.push(e);
                } else if (type === 2) {
                    saleOffTransactionList.push(e)
                }
            })
        } else {
            const saleOffFromDb = await saleoff_getAllByKiot(kiot_id);
            saleOffFromDb.forEach(e => {
                const type = e.type;
                if (type === 1) {
                    saleOffProductList.push(e);
                } else if (type === 2) {
                    saleOffTransactionList.push(e)
                }
            })
        }
        res.send(
            RESPONSE(
                {
                    [Fields.saleOffProductList]: saleOffProductList,
                    [Fields.saleOffTransactionList]: saleOffTransactionList
                },
                "Successful",
            )
        );

    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const getById = async (req, res) => {
    const id = req.query["Did"];

    try {
        if (!id) throw new Error("Missing required fields");

        const saleOffFromDb = await saleoff_getById(id);

        res.send(
            RESPONSE(
                {
                    [Fields.saleOffInfo]: saleOffFromDb
                },
                "Successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const create = async (req, res) => {
    const { id } = req.users;
    const {
        kiot_id,
        name_product,
        price,
        image,
        type
    } = req.body;
    try {
        if (
            !id
            || !kiot_id
            || !name_product
            || !price
        ) throw new Error("Missing required fields");

        if (await saleoff_getByName(name_product, kiot_id)) throw new Error("Sale off has already exist");

        const result = await saleoff_create({
            kiot_id,
            name_product,
            price,
            image,
            type,
            id
        });
        res.send(
            RESPONSE(
                {
                    [Fields.saleOffInfo]: result
                },
                "Create successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Create unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const update = async (req, res) => {
    const {
        saleOffId,
        name_product,
        price,
        image,
        type,
        active
    } = req.body;
    try {
        if (!saleOffId) throw new Error("Missing required fields");

        const result = await saleoff_updateById({
            saleOffId,
            name_product,
            price,
            image,
            type,
            active
        });
        res.send(
            RESPONSE(
                {
                    [Fields.saleOffInfo]: result
                },
                "Update successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Update unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};
