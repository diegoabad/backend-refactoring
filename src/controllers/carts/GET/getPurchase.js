import logger from "../../../utils/logger.js";
import {
  getCartsService,
  generateTicketService,
} from "../../../services/carts.service.js";

export const getPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const purchases = await getCartsService(userId);
    const purchase = purchases;

    if (!purchase || !purchase.products || purchase.products.length === 0) {
      logger.error(`
        The purchase is empty
        ${err.stack}  
      `);

      return res.status(400).render("errors/purchaseErr", {
        message: "The purchase is empty",
      });
    }

    const ticket = await generateTicketService(purchase, req.user.email);

    res.status(200).render("purchase", { purchase, ticket });
  } catch (err) {
    logger.error(`
      An error occurred when obtaining the purchase
      ${err.stack}  
    `);
    res
      .status(500)
      .json({ err: "An error occurred when obtaining the purchase" });
  }
};
