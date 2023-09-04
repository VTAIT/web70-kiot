import { RESPONSE } from "../globals/api.js";
import { MongoFields } from "../globals/fields/mongo.js";
import { ResponseFields } from "../globals/fields/response.js";
import {
  customer_create,
  customer_getAll,
  customer_getAllByKiot,
  customer_getById,
  customer_getByUserName,
  customer_updateById,
} from "../services/mongo/customer.js";

export const getAll = async (req, res) => {
  let { kiot_id, role } = req.users;
  let cussor = req.query[ResponseFields.cussor];

  if (!Number(cussor)) cussor = -1;
  let customerFromDb = [];

  try {
    // supper admin
    if (role === 1) {
      kiot_id = req.query[ResponseFields.did];
    }
    customerFromDb = await customer_getAllByKiot(kiot_id, cussor);
    res.send(
      RESPONSE(
        {
          [ResponseFields.customerList]: customerFromDb,
          [ResponseFields.cussor]:
            customerFromDb.slice(-1)[0][MongoFields.id] - 1,
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

    const customerFromDb = await customer_getById(id);

    res.send(
      RESPONSE(
        {
          [ResponseFields.customerInfo]: customerFromDb,
        },
        "Successful"
      )
    );
  } catch (e) {
    res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
  }
};

export const create = async (req, res) => {
  const { email, fullName, phone, address, gender, kiot_id } = req.body;

  const { username } = req.users;
  try {
    if (!username || !fullName || !phone || !address || !gender || !kiot_id)
      throw new Error("Missing required fields");

    if (await customer_getByUserName(fullName, kiot_id))
      throw new Error("Customer has already exist");

    const customerDoc = await customer_create({
      email,
      fullName,
      phone,
      address,
      gender,
      username,
      kiot_id,
    });

    res.send(
      RESPONSE(
        {
          [ResponseFields.customerInfo]: customerDoc,
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
  const {
    customerId,
    email,
    fullName,
    phone,
    address,
    gender,
    transaction,
    rank,
    active,
  } = req.body;

  try {
    if (!customerId) throw new Error("Missing required fields");

    const result = await customer_updateById({
      customerId,
      email,
      fullName,
      phone,
      address,
      gender,
      transaction,
      rank,
      active: Boolean(active),
    });
    res.send(
      RESPONSE(
        {
          [ResponseFields.customerInfo]: result,
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
