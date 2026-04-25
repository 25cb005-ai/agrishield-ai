import Time "mo:core/Time";
import OrderTypes "../types/order";
import OrderLib "../lib/order";

mixin (orders : OrderLib.State) {
  public shared query ({ caller }) func listOrdersByUser() : async [OrderTypes.Order] {
    OrderLib.listByUser(orders, caller.toText());
  };

  public shared query func getOrder(id : Text) : async ?OrderTypes.Order {
    OrderLib.getById(orders, id);
  };

  public shared ({ caller }) func createOrder(data : OrderTypes.CreateOrderInput) : async OrderTypes.Order {
    OrderLib.create(orders, data, caller.toText(), Time.now());
  };
};
