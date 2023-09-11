import { limit } from "../../globals/config.js";
import { MongoFields } from "../../globals/fields/mongo.js";
import { SaleOffModel } from "../../globals/mongodb.js";

export const saleoff_create = async (data) => {
  const { kiot_id, name_product, price, image, type, id, active } = data;

  const saleOffDoc = new SaleOffModel({
    _id: 0,
    kiot_id,
    name_product,
    price,
    image: image ? image : "",
    user_id: id,
    code: "",
    type,
    active,
  });

  return await saleOffDoc.save();
};

export const saleoff_updateById = async (data) => {
  const { saleOffId, name_product, price, image, type, active } = data;
  const existingSaleOff = await saleoff_getById(saleOffId);

  if (!existingSaleOff) throw new Error("Sale Off not already exist");

  // if (name_product === existingSaleOff.name_product)
  //   throw new Error("Sale Off has already exist");

  if (name_product) {
    existingSaleOff.name_product = name_product;
  }

  if (price) {
    existingSaleOff.price = price;
  }

  if (image) {
    existingSaleOff.image = image;
  }

  if (active != existingSaleOff.active) {
    existingSaleOff.active = JSON.parse(active);
  }

  if (type) {
    existingSaleOff.type = type;
  }

  return await existingSaleOff.save();
};

export const saleoff_getAll = async (cussor = -1) => {
  let query = {};

  if (cussor > 0) {
    query[MongoFields.id] = { $lte: cussor };
  }
  return await SaleOffModel.find(query)
    .sort({ [MongoFields.id]: -1 })
    .limit(limit);
};
export const saleoff_getAll_query = async (conditions) => {
  let query = {};
  const { cussor, search, rate, active, fromdate, todate } = conditions;

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

  if (rate) {
    const priceRange = rate.split("-"); //value in client = ["0-50", "50-100", "100"];
    const minPrice = parseInt(priceRange[0]);
    const maxPrice = parseInt(priceRange[1]);

    if (minPrice >= 0 && maxPrice) {
      query[MongoFields.price] = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query[MongoFields.price] = { $gte: minPrice };
    }
  }

  if (active) {
    query[MongoFields.active] = JSON.parse(active);
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

  return await SaleOffModel.find(query)
    .sort({ [MongoFields.id]: -1 })
    .limit(limit);
};

export const saleoff_getById = async (id) => {
  return await SaleOffModel.findOne({ [MongoFields.id]: id });
};

export const saleoff_getByName = async (name_product, kiot_id) => {
  return await SaleOffModel.findOne({
    [MongoFields.name_product]: name_product,
    [MongoFields.kiot_id]: kiot_id,
  });
};

export const saleoff_getAllByKiot = async (kiot_id, cussor = -1) => {
  let query = { [MongoFields.kiot_id]: kiot_id };

  if (cussor > 0) {
    query[MongoFields.id] = { $lte: cussor };
  }
  return await SaleOffModel.find(query)
    .sort({ [MongoFields.id]: -1 })
    .limit(limit);
};

export const saleoff_getAllByKiot_query = async (kiot_id, conditions) => {
  let query = { [MongoFields.kiot_id]: kiot_id };

  const { cussor, search, rate, active, fromdate, todate } = conditions;

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

  if (rate) {
    const priceRange = rate.split("-"); //value in client = ["0-50", "50-100", "100"];
    const minPrice = parseInt(priceRange[0]);
    const maxPrice = parseInt(priceRange[1]);

    if (minPrice >= 0 && maxPrice) {
      query[MongoFields.price] = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query[MongoFields.price] = { $gte: minPrice };
    }
  }

  if (active) {
    query[MongoFields.active] = JSON.parse(active);
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

  return await SaleOffModel.find(query)
    .sort({ [MongoFields.id]: -1 })
    .limit(limit);
};

export const saleoff_getByArray = async (array) => {
  let query = {};
  let saleoffList = [];

  if (array.length) {
    query[MongoFields.name_product] = { $in: array };
    query[MongoFields.type] = 1;
    saleoffList = await SaleOffModel.find(query);
  }
  return saleoffList;
};
export const saleoff_getByArray_admin = async (array) => {
  let query = {};
  let saleoffList = [];
  //need type: 1,2 to return
  if (array.length) {
    query[MongoFields.name_product] = { $in: array };
    saleoffList = await SaleOffModel.find(query);
  }
  return saleoffList;
};

export const saleoff_getByTracsaction = async (kiot_id) => {
  let query = {};
  if (kiot_id) {
    query[MongoFields.kiot_id] = kiot_id;
    query[MongoFields.type] = 2;
  }
  return await SaleOffModel.find(query).sort({
    [MongoFields.id]: -1,
  });
};
