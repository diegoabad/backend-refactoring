import productModel from "../../../dao/models/product.model.js";

export const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const updatedData = req.body;

  try {
  
    const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    // Redirigir a una página de confirmación o a la vista de detalles actualizada
    res.redirect(`/api/products/manager`);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
};
