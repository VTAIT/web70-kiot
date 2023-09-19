import { hashPassWord } from "../globals/config.js";
import {
  user_create,
  user_getAll,
  user_getAllByKiot,
  user_getById,
  user_getByUserName,
  user_updateById,
} from "../services/mongo/user.js";
import { kiot_create } from "../services/mongo/kiot.js";
import { registe_getAll, registe_getById } from "../services/mongo/register.js";
import { RESPONSE } from "../globals/api.js";
import { ResponseFields } from "../globals/fields/response.js";
import { MongoFields } from "../globals/fields/mongo.js";
import { uploadStream } from "../middlewares/multer.js";

export const getAll = async (req, res) => {
  try {
    let { kiot_id, role } = req.users;

    let cussor = req.query[ResponseFields.cussor];
    if (!Number(cussor)) cussor = -1;

    let accountFromDb = [];

    // supper admin
    if (role === 1) {
      kiot_id = req.query[ResponseFields.did];
    }
    accountFromDb = await user_getAllByKiot(kiot_id, cussor);

    res.send(
      RESPONSE(
        {
          [ResponseFields.accountList]: accountFromDb,
          [ResponseFields.cussor]: accountFromDb.slice(-1)[0]._id - 1,
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
    if (!id) throw new Error("Missing required ResponseFields");

    const accountFromDb = await user_getById(id);

    res.send(
      RESPONSE(
        {
          [ResponseFields.userInfo]: accountFromDb,
        },
        "Successful"
      )
    );
  } catch (e) {
    res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
  }
};

export const create = async (req, res) => {
  try {
    const { username, password, email, fullName, phone, address, role_id } =
      req.body;

    const { kiot_id } = req.users;

    if (!username || !password || !fullName || !phone || !address)
      throw new Error("Missing required ResponseFields");

    if (await user_getByUserName(username))
      throw new Error("User has already exist");

    const userDoc = await user_create({
      username,
      password,
      email,
      fullName,
      phone,
      address,
      status: 1,
      role_id: role_id ? role_id : 3,
      active: true,
      kiot_id,
    });

    delete userDoc[MongoFields.doc].password;

    res.send(
      RESPONSE(
        {
          [ResponseFields.userInfo]: userDoc,
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
    userId,
    password,
    email,
    fullName,
    phone,
    address,
    active,
    gender,
    role_id,
    status,
  } = req.body;
  try {
    if (!userId) throw new Error("Missing required ResponseFields");

    const result = await user_updateById({
      userId,
      password,
      email,
      fullName,
      phone,
      address,
      active: Boolean(active),
      gender,
      role_id: userId === req.users.id ? req.users.role : role_id,
      status,
    });

    delete result[MongoFields.doc].password;

    res.send(
      RESPONSE(
        {
          [ResponseFields.userInfo]: result,
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

export const getAllAccept = async (req, res) => {
  const { role } = req.users;
  let cussor = req.query[ResponseFields.cussor];
  if (!Number(cussor)) cussor = -1;

  try {
    if (role !== 1) throw new Error("Nothing");

    const RegisterFromDb = await registe_getAll(cussor);

    if (!RegisterFromDb || role !== 1) throw new Error("Nothing");

    res.send(
      RESPONSE(
        {
          [ResponseFields.accountList]: RegisterFromDb,
          [ResponseFields.cussor]: RegisterFromDb.slice(-1)[0]._id - 1,
        },
        "Successful"
      )
    );
  } catch (e) {
    res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
  }
};

export const acceptById = async (req, res) => {
  const { id } = req.body;

  try {
    if (!id) throw new Error("Missing information");

    const AccountFromDb = await registe_getById(id);

    if (!AccountFromDb) throw new Error("Account does not exist");

    const { username, password, email, fullName, phone, address } =
      AccountFromDb;

    const existingUser = await user_getByUserName(username);

    if (existingUser) throw new Error("User has already exist");

    const kiotModel = await kiot_create(username);

    const result = await user_create(
      {
        username,
        password,
        email,
        fullName,
        phone,
        address,
        role_id: 2,
        kiot_id: kiotModel[MongoFields.id],
      },
      false
    );

    AccountFromDb[MongoFields.status] = 1;
    await AccountFromDb.save();

    delete result[MongoFields.doc].password;

    res.send(
      RESPONSE(
        {
          [ResponseFields.userInfo]: result,
        },
        "Active successfully"
      )
    );
  } catch (e) {
    res
      .status(400)
      .send(RESPONSE([], "Active unsuccessful", e.errors, e.message));
  }
};

export const avatarUpload = async (req, res) => {
  try {
    const { id } = req.users;

    const src = await uploadStream(req.file.buffer);

    if (!src) throw new Error("Missing required fields");

    const result = await user_updateById({
      userId: id,
      avatarUrl: src.url,
    });
    delete result[MongoFields.doc].password;

    res.send(
      RESPONSE(
        {
          [ResponseFields.userInfo]: result,
        },
        "Update successful"
      )
    );
  } catch (error) {
    res.status(500).send(error);
  }
};
