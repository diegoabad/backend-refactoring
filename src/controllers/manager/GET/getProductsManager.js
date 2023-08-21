import productModel from "../../../dao/models/product.model.js";

export const getProductsManager = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("updateProducts",  product );
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Error fetching product");
  }
};
