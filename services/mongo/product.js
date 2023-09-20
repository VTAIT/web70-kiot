import { limit } from "../../globals/config.js";
import { MongoFields } from "../../globals/fields/mongo.js";
import { ProductModel } from "../../globals/mongodb.js";
import { formatDate } from "../../utils/index.js";

export const product_create = async (data) => {
  const {
    kiot_id,
    name_product,
    price,
    image,
    user_id,
    category,
    description,
    active,
  } = data;

  const productDoc = new ProductModel({
    _id: 0,
    kiot_id,
    name_product,
    price,
    image: image ? image : "http://dummyimage.com/420x420.png/5fa2dd/ffffff",
    user_id,
    category,
    code: "",
    active: true,
    description,
    active,
  });

  return await productDoc.save();
};

export const product_updateById = async (data) => {
  const {
    productId,
    active,
    name_product,
    price,
    image,
    category,
    description,
    kiot_id,
  } = data;

  const existingProduct = await product_getById(productId);

  if (!existingProduct) throw new Error("Product not already exist");

  // if (name_product === existingProduct.name_product)
  //     throw new Error("Product has already exist");

  if (name_product) {
    existingProduct.name_product = name_product;
  }

  if (price) {
    existingProduct.price = price;
  }

  if (image) {
    existingProduct.image = image;
  }

  if (active != existingProduct.active) {
    existingProduct.active = active;
  }

  if (category) {
    existingProduct.category = category;
  }

  if (description) {
    existingProduct.description = description;
  }

  if (kiot_id) {
    existingProduct.kiot_id = kiot_id;
  }

  return await existingProduct.save();
};

export const product_getAll = async (cussor = -1) => {
  let query = {};

  if (cussor > 0) {
    query[MongoFields.id] = { $lte: cussor };
  }

  return await ProductModel.find(query)
    .sort({ [MongoFields.id]: -1 })
    .limit(limit);
};

export const product_getAll_query = async (conditions) => {
  let query = {};

  const { cussor, search, price, category, fromdate, todate } = conditions;

  let cussorNumber = parseInt(cussor);

  if (!cussorNumber) {
    cussorNumber = -1;
  }

  if (cussorNumber && cussorNumber > 0) {
    query[MongoFields.id] = { $lte: cussorNumber };
  }

  if (search) {
    const id = parseInt(search);
    if (id) {
      query[MongoFields.id] = id;
    } else {
      query[MongoFields.name_product] = { $regex: search, $options: "i" };
    }
  }

  if (price) {
    const priceRange = price.split("-"); //value in client = ["0-50", "50-100", "100"];
    const minPrice = parseInt(priceRange[0]);
    const maxPrice = parseInt(priceRange[1]);

    if (minPrice >= 0 && maxPrice) {
      query[MongoFields.price] = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query[MongoFields.price] = { $gte: minPrice };
    }
  }

  if (category) {
    query[MongoFields.category] = category;
  }

  if (fromdate && todate) {
    query[MongoFields.createdAt] = {
      $gte: new Date(fromdate),
      $lte: new Date(todate),
    };
  }

  if (fromdate && !todate) {
    query[MongoFields.createdAt] = { $gte: new Date(fromdate) };
  }

  if (todate && !fromdate) {
    query[MongoFields.createdAt] = { $lte: new Date(todate) };
  }

  return await ProductModel.find(query)
    .sort({ [MongoFields.id]: -1 })
    .limit(limit);
};

export const product_getById = async (id) => {
  return await ProductModel.findOne({ [MongoFields.id]: id });
};

export const product_getByName = async (name_product, kiot_id) => {
  return await ProductModel.findOne({
    [MongoFields.name_product]: name_product,
    [MongoFields.kiot_id]: kiot_id,
  });
};

export const product_getAllByKiot = async (kiot_id, cussor = -1) => {
  let query = { [MongoFields.kiot_id]: kiot_id };

  if (cussor > 0) {
    query[MongoFields.id] = { $lte: cussor };
  }
  return await ProductModel.find(query)
    .sort({ [MongoFields.id]: -1 })
    .limit(limit);
};

export const product_getAllByKiot_query = async (kiot_id, conditions) => {
  let query = { [MongoFields.kiot_id]: kiot_id };

  const { cussor, search, price, category, fromdate, todate } = conditions;

  let cussorNumber = parseInt(cussor);

  if (!cussorNumber) {
    cussorNumber = -1;
  }

  if (cussorNumber && cussorNumber > 0) {
    query[MongoFields.id] = { $lte: cussorNumber };
  }

  if (search) {
    const id = parseInt(search);
    if (id) {
      query[MongoFields.id] = id;
    } else {
      query[MongoFields.name_product] = { $regex: search, $options: "i" };
    }
  }

  if (price) {
    const priceRange = price.split("-"); //value in client = ["0-50", "50-100", "100"];
    const minPrice = parseInt(priceRange[0]);
    const maxPrice = parseInt(priceRange[1]);

    if (minPrice >= 0 && maxPrice) {
      query[MongoFields.price] = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query[MongoFields.price] = { $gte: minPrice };
    }
  }

  if (category) {
    query[MongoFields.category] = category;
  }

  if (fromdate && todate) {
    query[MongoFields.createdAt] = {
      $gte: new Date(fromdate),
      $lte: new Date(todate),
    };
  }

  if (fromdate && !todate) {
    query[MongoFields.createdAt] = { $gte: new Date(fromdate) };
  }

  if (todate && !fromdate) {
    query[MongoFields.createdAt] = { $lte: new Date(todate) };
  }

  return await ProductModel.find(query)
    .sort({ [MongoFields.id]: -1 })
    .limit(limit);
};
