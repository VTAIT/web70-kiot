import { RESPONSE } from "../globals/api.js";
import { ResponseFields } from "../globals/fields/response.js";
import {
  saleoff_create,
  saleoff_getAll,
  saleoff_getAllByKiot,
  saleoff_getAllByKiot_query,
  saleoff_getAll_query,
  saleoff_getById,
  saleoff_getByName,
  saleoff_updateById,
} from "../services/mongo/saleoff.js";

export const getAll = async (req, res) => {
  const { kiot_id, role } = req.users;
  let cussor = req.query[ResponseFields.cussor];
  let Did = kiot_id ? kiot_id : req.query[ResponseFields.did];

  if (!Number(cussor)) cussor = -1;

  let saleOffFromDb = [];
  let saleOffProductList = [];
  let saleOffTransactionList = [];

  try {
    // supper admin
    if (role === 1 && cussor !== 0 && !Did) {
      saleOffFromDb = await saleoff_getAll(cussor);
      saleOffFromDb.forEach((e) => {
        const type = e.type;
        if (type === 1) {
          saleOffProductList.push(e);
        } else if (type === 2) {
          saleOffTransactionList.push(e);
        }
      });
    } else if (cussor !== 0) {
      saleOffFromDb = await saleoff_getAllByKiot(Did, cussor);
      saleOffFromDb.forEach((e) => {
        const type = e.type;
        if (type === 1) {
          saleOffProductList.push(e);
        } else if (type === 2) {
          saleOffTransactionList.push(e);
        }
      });
    }
    res.send(
      RESPONSE(
        {
          [ResponseFields.saleOffProductList]: saleOffProductList,
          [ResponseFields.saleOffTransactionList]: saleOffTransactionList,
          [ResponseFields.cussor]: saleOffFromDb.length
            ? saleOffFromDb.slice(-1)[0]._id - 1
            : 0,
        },
        "Successful"
      )
    );
  } catch (e) {
    res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
  }
};

export const getAll_query = async (req, res) => {
  const { kiot_id, role } = req.users;
  const conditions = req.query;

  let cussor = conditions[ResponseFields.cussor];
  let Did = kiot_id ? kiot_id : conditions[ResponseFields.did];

  if (!Number(cussor)) cussor = -1;

  let saleOffFromDb = [];
  let saleOffProductList = [];
  let saleOffTransactionList = [];

  try {
    // supper admin
    if (role === 1 && cussor !== 0 && !Did) {
      saleOffFromDb = await saleoff_getAll_query(conditions);
      saleOffFromDb.forEach((e) => {
        const type = e.type;
        if (type === 1) {
          saleOffProductList.push(e);
        } else if (type === 2) {
          saleOffTransactionList.push(e);
        }
      });
    } else if (cussor !== 0) {
      saleOffFromDb = await saleoff_getAllByKiot_query(Did, conditions);
      saleOffFromDb.forEach((e) => {
        const type = e.type;
        if (type === 1) {
          saleOffProductList.push(e);
        } else if (type === 2) {
          saleOffTransactionList.push(e);
        }
      });
    }
    res.send(
      RESPONSE(
        {
          [ResponseFields.saleOffProductList]: saleOffProductList,
          [ResponseFields.saleOffTransactionList]: saleOffTransactionList,
          [ResponseFields.cussor]: saleOffFromDb.length
            ? saleOffFromDb.slice(-1)[0]._id - 1
            : 0,
        },
        "Successful"
      )
    );
  } catch (e) {
    res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
  }
};

export const getById = async (req, res) => {
  const id = req.query[ResponseFields.did];

  try {
    if (!id) throw new Error("Missing required fields");

    const saleOffFromDb = await saleoff_getById(id);

    res.send(
      RESPONSE(
        {
          [ResponseFields.saleOffInfo]: saleOffFromDb,
        },
        "Successful"
      )
    );
  } catch (e) {
    res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
  }
};

export const create = async (req, res) => {
  const { id } = req.users;
  const { kiot_id, name_product, rate, image, type, active } = req.body;
  try {
    if (!id || !kiot_id || !name_product || !rate)
      throw new Error("Missing required fields");

    if (await saleoff_getByName(name_product, kiot_id))
      throw new Error("Sale off has already exist");

    const result = await saleoff_create({
      kiot_id,
      name_product,
      price: rate,
      image,
      type,
      id,
      active,
    });
    res.send(
      RESPONSE(
        {
          [ResponseFields.saleOffInfo]: result,
        },
        "Create successful"
      )
    );
  } catch (e) {
    res
      .status(400)
      .send(RESPONSE([], "Create unsuccessful", e.errors, e.message));
  }
};

export const update = async (req, res) => {
  const { saleOffId, name_product, rate, image, type, active } = req.body;
  try {
    if (!saleOffId) throw new Error("Missing required fields");

    const result = await saleoff_updateById({
      saleOffId,
      name_product,
      price: rate,
      image,
      type,
      active,
    });
    res.send(
      RESPONSE(
        {
          [ResponseFields.saleOffInfo]: result,
        },
        "Update successful"
      )
    );
  } catch (e) {
    res
      .status(400)
      .send(RESPONSE([], "Update unsuccessful", e.errors, e.message));
  }
};
