import { RESPONSE } from "../globals/api.js";
import { ResponseFields } from "../globals/fields/response.js";

import {
  product_create,
  product_getAll,
  product_getAllByKiot,
  product_getAllByKiot_query,
  product_getAll_query,
  product_getById,
  product_getByName,
  product_updateById,
} from "../services/mongo/product.js";
import {
  saleoff_getByArray,
  saleoff_getByArray_admin,
  saleoff_getByTracsaction,
} from "../services/mongo/saleoff.js";

export const getAll = async (req, res) => {
  try {
    const { kiot_id, role } = req.users;

    let cussor = parseInt(req.query[ResponseFields.cussor]);
    let Did = kiot_id ? kiot_id : req.query[ResponseFields.did];

    let productFromDb = [];
    let saleOffProductList = [];
    let saleOffTransactionList = [];

    // supper admin
    //when cussor = 0 ~ the last item => return [], query all if Did= F, query by kiot if Did = T
    if (role === 1 && cussor !== 0 && !Did) {
      productFromDb = await product_getAll(cussor);

      let array = [];
      productFromDb.forEach((e) => {
        array.push(e.name_product);
      });

      const saleOffFromDb = await saleoff_getByArray_admin(array);

      saleOffFromDb.forEach((e) => {
        const type = e.type;
        if (type === 1) {
          saleOffProductList.push(e);
        } else if (type === 2) {
          saleOffTransactionList.push(e);
        }
      });
    } else if (cussor !== 0) {
      productFromDb = await product_getAllByKiot(Did, cussor);

      let array = [];
      productFromDb.forEach((e) => {
        array.push(e.name_product);
      });

      saleOffProductList = await saleoff_getByArray(array);
      saleOffTransactionList = await saleoff_getByTracsaction(Did);
    }

    res.send(
      RESPONSE(
        {
          [ResponseFields.productList]: productFromDb,
          [ResponseFields.saleOffProductList]: saleOffProductList,
          [ResponseFields.saleOffTransactionList]: saleOffTransactionList,
          [ResponseFields.cussor]: productFromDb.length
            ? productFromDb.slice(-1)[0]._id - 1
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
  try {
    const { kiot_id, role } = req.users;

    const conditions = req.query;

    let cussor = parseInt(conditions[ResponseFields.cussor]);
    let Did = kiot_id ? kiot_id : conditions[ResponseFields.did];

    let productFromDb = [];
    let saleOffProductList = [];
    let saleOffTransactionList = [];

    // supper admin
    if (role === 1 && cussor !== 0 && !Did) {
      productFromDb = await product_getAll_query(conditions);

      let array = [];

      productFromDb.forEach((e) => {
        array.push(e.name_product);
      });

      const saleOffFromDb = await saleoff_getByArray_admin(array);
      saleOffFromDb.forEach((e) => {
        const type = e.type;
        if (type === 1) {
          saleOffProductList.push(e);
        } else if (type === 2) {
          saleOffTransactionList.push(e);
        }
      });
    } else if (cussor !== 0) {
      productFromDb = await product_getAllByKiot_query(Did, conditions);
      let array = [];
      productFromDb.forEach((e) => {
        array.push(e.name_product);
      });
      saleOffProductList = await saleoff_getByArray(array);
      saleOffTransactionList = await saleoff_getByTracsaction(Did);
    }
    res.send(
      RESPONSE(
        {
          [ResponseFields.productList]: productFromDb,
          [ResponseFields.saleOffProductList]: saleOffProductList,
          [ResponseFields.saleOffTransactionList]: saleOffTransactionList,
          [ResponseFields.cussor]: productFromDb.length
            ? productFromDb.slice(-1)[0]._id - 1
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

    const productFromDb = await product_getById(id);

    res.send(
      RESPONSE(
        {
          [ResponseFields.productInfo]: productFromDb,
        },
        "Successful"
      )
    );
  } catch (e) {
    res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
  }
};

export const create = async (req, res) => {
  const { id, kiot_id } = req.users;

  const data = req.body;
  const { name_product, price, category, description, active, image } = data;

  try {
    if (!name_product || !price || !category || !description || !active)
      throw new Error("Missing required fields");

    const exist = await product_getByName(
      name_product,
      kiot_id ? kiot_id : data.kiot_id,
      category
    );

    if (exist) throw new Error("Product has already exist");

    const result = await product_create({
      kiot_id: kiot_id ? kiot_id : data.kiot_id,
      name_product,
      price,
      image,
      user_id: id,
      category,
      description,
      active,
    });
    res.send(
      RESPONSE(
        {
          [ResponseFields.productInfo]: result,
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
  const data = req.body;

  const {
    productId,
    active,
    name_product,
    price,
    category,
    description,
    image,
    kiot_id,
  } = data;

  try {
    if (!productId) throw new Error("Missing required fields");

    const result = await product_updateById({
      productId,
      active,
      name_product,
      price,
      image,
      category,
      description,
      kiot_id,
    });

    res.send(
      RESPONSE(
        {
          [ResponseFields.productInfo]: result,
        },
        "Update successful"
      )
    );
  } catch (e) {
    let messages = [];
    for (const key in e.errors) {
      const element = e.errors[key];
      messages.push(element.message);
    }
    res.status(400).send({
      error: messages,
      message: "Update unsuccessful 1",
      catch: e.message,
    });
  }
};
