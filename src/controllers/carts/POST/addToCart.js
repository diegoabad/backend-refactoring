import { addToCartService } from "../../../services/carts.service.js";
import logger from "../../../utils/logger.js";

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  try {
    const cart = await addToCartService(productId, userId);

    logger.info(`Product ${productId} added to cart`);

    res.redirect("/api/products");
  } catch (err) {
    logger.error(
      "An error occurred while adding the product to the cart\n",
      err
    );
    res
      .status(500)
      .json({
        err:
          err.message ||
          "An error occurred while adding the product to the cart",
      });
  }
};
